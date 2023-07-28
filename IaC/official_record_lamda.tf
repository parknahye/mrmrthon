resource "aws_lambda_function" "official_record_lambda_tf" {
  filename      = "official_record_lambda_tf.zip"
  function_name = "official_record_lambda_tf"
  role          = aws_iam_role.official_record_lambda_role_tf.arn
  handler       = "index.js"
  runtime       = "nodejs14.x"
}

// DynamoDB 트리거 구성
resource "aws_lambda_event_source_mapping" "official_record_lambda_trigger_tf" {
  event_source_arn                   = "arn:aws:dynamodb:ap-northeast-2:477644685304:table/official_record/stream/2023-06-20T01:24:22.841"
  function_name                      = aws_lambda_function.official_record_lambda_tf.function_name
  starting_position                  = "LATEST"
  batch_size                         = 1
  maximum_batching_window_in_seconds = 60
}

resource "aws_iam_role" "official_record_lambda_role_tf" {
  name = "official_record_lambda_role_tf"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "tf_access_official_record_stream_attachment" {
  role       = aws_iam_role.official_record_lambda_role_tf.name
  policy_arn = "arn:aws:iam::477644685304:policy/AccessOfficialRecordStreamOnly"
}

resource "aws_iam_role_policy_attachment" "tf_lambda_function_destination_attachment" {
  role       = aws_iam_role.official_record_lambda_role_tf.name
  policy_arn = "arn:aws:iam::477644685304:policy/service-role/AWSLambdaLambdaFunctionDestinationExecutionRole-bd40a17d-6fde-4797-bcd3-295cb2ff69c0"
}

resource "aws_iam_role_policy_attachment" "tf_sns_topic_destination_attachment" {
  role       = aws_iam_role.official_record_lambda_role_tf.name
  policy_arn = "arn:aws:iam::477644685304:policy/service-role/AWSLambdaSNSTopicDestinationExecutionRole-6adf8edf-f39f-4d04-87c1-21d85acef0ed"
}

resource "aws_iam_role_policy_attachment" "tf_dynamodb_read_only_attachment" {
  role       = aws_iam_role.official_record_lambda_role_tf.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
}