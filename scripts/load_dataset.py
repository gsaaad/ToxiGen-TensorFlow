"""
ToxiGen Dataset Loader and DynamoDB Uploader
Loads the ToxiGen dataset and uploads it to AWS DynamoDB

Usage:
    python scripts/load_dataset.py --create-table  # Create DynamoDB table first
    python scripts/load_dataset.py --upload        # Upload data to DynamoDB
    python scripts/load_dataset.py --sample 1000   # Upload only 1000 samples
    python scripts/load_dataset.py --local         # Use local DynamoDB
"""

import os
import sys
import json
import argparse
import uuid
from datetime import datetime

# Check for required packages
try:
    from datasets import load_dataset
    import boto3
    from botocore.exceptions import ClientError
except ImportError as e:
    print(f"Missing required package: {e}")
    print("Install with: pip install datasets boto3")
    sys.exit(1)


def get_dynamodb_client(use_local=False):
    """Get DynamoDB client with appropriate configuration"""
    if use_local:
        return boto3.resource(
            'dynamodb',
            endpoint_url='http://localhost:8000',
            region_name='us-east-1',
            aws_access_key_id='fakeAccessKey',
            aws_secret_access_key='fakeSecretKey'
        )

    # Use environment variables or AWS credentials file
    return boto3.resource(
        'dynamodb',
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )


def create_table(dynamodb, table_name='toxigen_dataset'):
    """Create the DynamoDB table if it doesn't exist"""
    try:
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {'AttributeName': 'id', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )

        print(f"Creating table {table_name}...")
        table.wait_until_exists()
        print(f"Table {table_name} created successfully!")
        return table

    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"Table {table_name} already exists.")
            return dynamodb.Table(table_name)
        else:
            raise


def load_toxigen_data(subset='annotated', max_samples=None):
    """Load ToxiGen dataset from HuggingFace"""
    print(f"Loading ToxiGen dataset (subset: {subset})...")

    try:
        ds = load_dataset("toxigen/toxigen-data", subset)

        # Get the train split
        if 'train' in ds:
            data = ds['train']
        else:
            # Get the first available split
            split_name = list(ds.keys())[0]
            data = ds[split_name]

        print(f"Loaded {len(data)} items from ToxiGen dataset")

        if max_samples and max_samples < len(data):
            data = data.select(range(max_samples))
            print(f"Limited to {max_samples} samples")

        return data

    except Exception as e:
        print(f"Error loading dataset: {e}")
        print("\nTrying alternative subsets...")

        for alt_subset in ['annotated', 'annotations', 'prompts']:
            try:
                print(f"Attempting to load '{alt_subset}' subset...")
                ds = load_dataset("toxigen/toxigen-data", alt_subset)
                split_name = list(ds.keys())[0]
                data = ds[split_name]
                print(f"Successfully loaded {len(data)} items")

                if max_samples and max_samples < len(data):
                    data = data.select(range(max_samples))

                return data
            except Exception:
                continue

        raise Exception("Could not load any ToxiGen subset")


def prepare_item(item, index):
    """Prepare a single item for DynamoDB"""
    # Generate unique ID
    item_id = str(uuid.uuid4())

    # Extract fields based on dataset structure
    prepared = {
        'id': item_id,
        'index': index,
        'created_at': datetime.utcnow().isoformat()
    }

    # Handle different possible field names
    if 'text' in item:
        prepared['text'] = str(item['text'])
    elif 'generation' in item:
        prepared['text'] = str(item['generation'])
    elif 'prompt' in item:
        prepared['text'] = str(item['prompt'])

    # Toxicity label
    if 'toxicity_label' in item:
        prepared['toxicity_label'] = int(item['toxicity_label'])
    elif 'toxicity_ai' in item:
        prepared['toxicity_label'] = 1 if item['toxicity_ai'] > 0.5 else 0
    elif 'label' in item:
        prepared['toxicity_label'] = int(item['label'])
    else:
        prepared['toxicity_label'] = 0

    # Target group
    if 'target_group' in item:
        prepared['target_group'] = str(item['target_group'])
    elif 'group' in item:
        prepared['target_group'] = str(item['group'])
    else:
        prepared['target_group'] = 'unknown'

    # Additional fields if available
    if 'toxicity_human' in item:
        prepared['toxicity_human'] = float(item['toxicity_human'])

    if 'toxicity_ai' in item:
        prepared['toxicity_ai'] = float(item['toxicity_ai'])

    return prepared


def upload_data(dynamodb, data, table_name='toxigen_dataset', batch_size=25):
    """Upload data to DynamoDB in batches"""
    table = dynamodb.Table(table_name)

    total = len(data)
    uploaded = 0
    failed = 0

    print(f"\nUploading {total} items to DynamoDB...")
    print(f"Table: {table_name}")
    print("-" * 50)

    # Process in batches
    for i in range(0, total, batch_size):
        batch = []
        batch_end = min(i + batch_size, total)

        for j in range(i, batch_end):
            try:
                item = prepare_item(data[j], j)
                batch.append(item)
            except Exception as e:
                print(f"Error preparing item {j}: {e}")
                failed += 1

        # Batch write
        try:
            with table.batch_writer() as writer:
                for item in batch:
                    writer.put_item(Item=item)
            uploaded += len(batch)
        except Exception as e:
            print(f"Error writing batch starting at {i}: {e}")
            failed += len(batch)

        # Progress update
        progress = (batch_end / total) * 100
        print(f"Progress: {batch_end}/{total} ({progress:.1f}%)", end='\r')

    print(f"\n\nUpload complete!")
    print(f"Successfully uploaded: {uploaded}")
    print(f"Failed: {failed}")

    return uploaded, failed


def export_sample_json(data, output_file='sample_data.json', max_samples=100):
    """Export a sample of the dataset to JSON for testing"""
    samples = []

    for i in range(min(max_samples, len(data))):
        item = prepare_item(data[i], i)
        samples.append(item)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(samples, f, indent=2, ensure_ascii=False)

    print(f"Exported {len(samples)} samples to {output_file}")


def main():
    parser = argparse.ArgumentParser(description='Load ToxiGen dataset and upload to DynamoDB')
    parser.add_argument('--create-table', action='store_true', help='Create DynamoDB table')
    parser.add_argument('--upload', action='store_true', help='Upload data to DynamoDB')
    parser.add_argument('--sample', type=int, help='Limit to N samples')
    parser.add_argument('--local', action='store_true', help='Use local DynamoDB')
    parser.add_argument('--table', default='toxigen_dataset', help='DynamoDB table name')
    parser.add_argument('--subset', default='annotated', help='ToxiGen subset to load')
    parser.add_argument('--export-json', action='store_true', help='Export sample to JSON')

    args = parser.parse_args()

    # Check if any action specified
    if not any([args.create_table, args.upload, args.export_json]):
        parser.print_help()
        print("\nExamples:")
        print("  python scripts/load_dataset.py --create-table")
        print("  python scripts/load_dataset.py --upload --sample 1000")
        print("  python scripts/load_dataset.py --export-json --sample 100")
        return

    # Get DynamoDB client
    dynamodb = get_dynamodb_client(args.local)
    print(f"Using {'local' if args.local else 'AWS'} DynamoDB")

    # Create table if requested
    if args.create_table:
        create_table(dynamodb, args.table)

    # Load and upload data
    if args.upload or args.export_json:
        data = load_toxigen_data(args.subset, args.sample)

        if args.export_json:
            export_sample_json(data, 'sample_data.json', args.sample or 100)

        if args.upload:
            upload_data(dynamodb, data, args.table)


if __name__ == '__main__':
    main()
