# SQS Queue
resource "aws_sqs_queue" "api_queue_tf" {
  name                       = "api-queue_tf"
  delay_seconds              = 0
  max_message_size           = 262144
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 0
  visibility_timeout_seconds = 30

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.api_dlq_tf.arn
    maxReceiveCount     = 10
  })
}

# SQS Dead Letter Queue (DLQ)
resource "aws_sqs_queue" "api_dlq_tf" {
  name = "api-dlq_tf"
}

# SNS Topic
resource "aws_sns_topic" "api_receive_tf" {
  name = "api-receive_tf"
}

# SNS Topic Subscription
resource "aws_sns_topic_subscription" "api_sns_subscription_tf" {
  topic_arn = aws_sns_topic.api_receive_tf.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.api_queue_tf.arn
}