resource "aws_lambda_function" "point_increase_lambda_tf" {
  filename      = "point_increase_lambda_tf.zip"
  function_name = "point_increase_lambda_tf"
  role          = aws_iam_role.point_increase_lambda_role_tf.arn
  handler       = "index.js"
  runtime       = "nodejs14.x"
}

// DynamoDB 트리거 구성
resource "aws_lambda_event_source_mapping" "point_increase_lambda_trigger_tf" {
  event_source_arn                   = "arn:aws:sqs:ap-northeast-2:477644685304:api-queue_tf"
  function_name                      = aws_lambda_function.point_increase_lambda_tf.function_name
  batch_size                         = 100
  maximum_batching_window_in_seconds = 60
}

resource "aws_iam_role" "point_increase_lambda_role_tf" {
  name = "point_increase_lambda_role_tf"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "sqs.amazonaws.com"
      } }
    ]
  })
}

resource "aws_iam_role_policy" "tf_network_interface_attachment" {
  name = "network_interface_attachment"
  role = aws_iam_role.point_increase_lambda_role_tf.name
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "LambdaBasicExecution",
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "arn:aws:logs:*:*:*"
      },
      {
        "Sid" : "LambdaVPCAccess",
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateNetworkInterface",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:AssignPrivateIpAddresses"
        ],
        "Resource" : "*"
      },
      {
        "Sid" : "EC2DescribeInstances",
        "Effect" : "Allow",
        "Action" : "ec2:DescribeInstances",
        "Resource" : "*"
      },
      {
        "Sid" : "EC2DescribeVpcs",
        "Effect" : "Allow",
        "Action" : "ec2:DescribeVpcs",
        "Resource" : "*"
      },
      {
        "Sid" : "EC2DescribeSubnets",
        "Effect" : "Allow",
        "Action" : "ec2:DescribeSubnets",
        "Resource" : "*"
      },
      {
        "Sid" : "SQSReceiveMessage",
        "Effect" : "Allow",
        "Action" : "sqs:ReceiveMessage",
        "Resource" : "*"
      },
      {
        "Sid" : "SQSSendMessage",
        "Effect" : "Allow",
        "Action" : "sqs:SendMessage",
        "Resource" : "*"
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "tf_lambda_basic_execution_Role_attachment" {
  role       = aws_iam_role.point_increase_lambda_role_tf.name
  policy_arn = "arn:aws:iam::477644685304:policy/service-role/AWSLambdaBasicExecutionRole-d57c3dff-89a1-464e-97ab-f7da43fe9e06"
}

resource "aws_iam_role_policy_attachment" "tf_rds_full_access_attachment" {
  role       = aws_iam_role.point_increase_lambda_role_tf.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
}

resource "aws_iam_role_policy_attachment" "tf_sqs_full_Access_attachment" {
  role       = aws_iam_role.point_increase_lambda_role_tf.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
}