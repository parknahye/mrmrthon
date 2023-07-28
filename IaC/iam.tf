resource "aws_iam_role" "ecsIAM_tf" {
  name               = "ecsIAM_tf"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "secretsmanager-policy" {
  name        = "secretsmanager-policy"
  description = "A secretsmanager policy"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "secretsmanager:*",
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy_attachment_tf" {
  role       = aws_iam_role.ecsIAM_tf.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy_attachment_tf_2" {
  role       = aws_iam_role.ecsIAM_tf.name
  policy_arn = aws_iam_policy.secretsmanager-policy.arn
}



# resource "aws_iam_role" "ecs_task_role_tf" {
#   name = "ecs-task-role"

#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Sid": "",
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "ecs-tasks.amazonaws.com"
#       },
#       "Action": "sts:AssumeRole"
#     }
#   ]
# }
# EOF
# }


# resource "aws_iam_role_policy_attachment" "ecs_task_role_policy_attachment_tf" {
#   role       = aws_iam_role.ecs_task_role_tf.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
# }