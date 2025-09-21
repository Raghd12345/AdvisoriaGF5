import json
import os
import boto3
import uuid
from datetime import datetime
from typing import Dict, Any

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')

# Table references
business_table = dynamodb.Table(os.environ['BUSINESS_TABLE'])
campaigns_table = dynamodb.Table(os.environ['CAMPAIGNS_TABLE'])
items_table = dynamodb.Table(os.environ['ITEMS_TABLE'])
comparisons_table = dynamodb.Table(os.environ['COMPARISONS_TABLE'])
chat_sessions_table = dynamodb.Table(os.environ['CHAT_SESSIONS_TABLE'])
chat_messages_table = dynamodb.Table(os.environ['CHAT_MESSAGES_TABLE'])

UPLOADS_BUCKET = os.environ['UPLOADS_BUCKET']

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Main Lambda handler with routing"""
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Content-Type': 'application/json'
    }
    
    try:
        method = event['requestContext']['http']['method']
        path = event['requestContext']['http']['path']
        
        if method == 'OPTIONS':
            return {'statusCode': 200, 'headers': headers, 'body': ''}
        
        # Route requests
        if path == '/signup' and method == 'POST':
            return handle_signup(event, headers)
        elif path == '/campaigns' and method == 'POST':
            return handle_create_campaign(event, headers)
        elif path == '/items' and method == 'GET':
            return handle_get_items(event, headers)
        elif path == '/items' and method == 'POST':
            return handle_create_item(event, headers)
        elif path == '/uploads/presign' and method == 'POST':
            return handle_presigned_upload(event, headers)
        else:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'success': False, 'error': 'Endpoint not found'})}
            
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_signup(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Handle business signup"""
    try:
        body = json.loads(event['body'])
        
        business = {
            'businessId': str(uuid.uuid4()),
            'name': body['name'],
            'industry': body['industry'],
            'country': body['country'],
            'city': body['city'],
            'zipCode': body['zipCode'],
            'workingHours': body['workingHours'],
            'createdAt': datetime.utcnow().isoformat()
        }
        
        if 'logo' in body:
            business['logo'] = body['logo']
        
        business_table.put_item(Item=business)
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': business})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_create_campaign(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Handle campaign creation"""
    try:
        body = json.loads(event['body'])
        
        campaign = {
            'campaignId': str(uuid.uuid4()),
            'businessId': body['businessId'],
            'goal': body['goal'],
            'targetAudience': body['targetAudience'],
            'budget': body['budget'],
            'status': body.get('status', 'draft'),
            'createdAt': datetime.utcnow().isoformat()
        }
        
        campaigns_table.put_item(Item=campaign)
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': campaign})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_get_items(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Handle get all items"""
    try:
        response = items_table.scan()
        items = response.get('Items', [])
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': items})}
        
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_create_item(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Handle create generic item"""
    try:
        body = json.loads(event['body'])
        
        item = {
            'pk': str(uuid.uuid4()),
            **body,
            'createdAt': datetime.utcnow().isoformat()
        }
        
        items_table.put_item(Item=item)
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': item})}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}

def handle_presigned_upload(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Handle presigned URL generation for file uploads"""
    try:
        body = json.loads(event['body'])
        file_name = body['fileName']
        file_type = body['fileType']
        
        key = f"uploads/{uuid.uuid4()}_{file_name}"
        
        upload_url = s3_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': UPLOADS_BUCKET, 'Key': key, 'ContentType': file_type},
            ExpiresIn=3600
        )
        
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'success': True,
            'data': {'uploadUrl': upload_url, 'key': key}
        })}
        
    except Exception as e:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'success': False, 'error': str(e)})}