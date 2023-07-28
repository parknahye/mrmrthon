# task definition
# user
resource "aws_ecs_task_definition" "user_server_task_definition_tf" {
  family                   = "user_server_task_definition_tf"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 3072
  execution_role_arn       = aws_iam_role.ecsIAM_tf.arn
  task_role_arn            = aws_iam_role.ecsIAM_tf.arn
  runtime_platform {
    cpu_architecture = "X86_64"
    operating_system_family = "LINUX"
  }
  
  # Created on the first run and then managed by the CD Tool (Bamboo).
  container_definitions = jsonencode(
    [
      # Application Container
      {
        essential = true
        name      = "user_server_container_tf"
        image     = "${aws_ecr_repository.user_server_ecr-tf.repository_url}:latest"
        cpu = 0
        portMappings = [
          {
            name = "user_server_container-9000-tcp"
            protocol      = "tcp"
            appProtocol = "http"
            containerPort = 9000
            hostPort      = 9000
          }
        ]
        logConfiguration = {
          logDriver = "awslogs",
          options = {
            awslogs-group         = "/ecs/user_server_task_definition_tf"
            awslogs-region        = "ap-northeast-2",
            awslogs-stream-prefix = "ecs"
          }
        }
        secrets = [
                {
                    name = "MYSQL_HOST",
                    valueFrom = "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_HOST::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name = "MYSQL_USER",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_USER::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name= "MYSQL_PASSWORD",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_PASSWORD::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name= "MYSQL_DB",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_DB::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                }
            ]
      }
    ]
  )
}

# main
resource "aws_ecs_task_definition" "main_server_task_definition_tf" {
  family                   = "main_server_task_definition_tf"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 3072
  execution_role_arn       = aws_iam_role.ecsIAM_tf.arn
  task_role_arn            = aws_iam_role.ecsIAM_tf.arn
  runtime_platform {
    cpu_architecture = "X86_64"
    operating_system_family = "LINUX"
  }


  # Created on the first run and then managed by the CD Tool (Bamboo).
  container_definitions = jsonencode(
    [
      # Application Container
      {
        essential = true
        name      = "main_server_container_tf"
        image     = "${aws_ecr_repository.main_server_ecr-tf.repository_url}:latest"
        cpu = 0
        portMappings = [
          {
            name = "mainr_server_container-9000-tcp"
            protocol      = "tcp"
            appProtocol = "http"
            containerPort = 9000
            hostPort      = 9000
          }
        ]
        logConfiguration = {
          logDriver = "awslogs",
          options = {
            awslogs-group         = "/ecs/main_server_task_definition_tf"
            awslogs-region        = "ap-northeast-2",
            awslogs-stream-prefix = "ecs"
          }
        }
        secrets= [
                {
                    name= "AWS_ACCESS_KEY_ID",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:access_key-GOTkWJ:AWS_ACCESS_KEY_ID_TF::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name= "AWS_SECRET_ACCESS_KEY",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:access_key-GOTkWJ:AWS_SECRET_ACCESS_KEY_TF::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name = "MYSQL_HOST",
                    valueFrom = "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_HOST::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name = "MYSQL_USER",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_USER::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name= "MYSQL_PASSWORD",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_PASSWORD::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                },
                {
                    name= "MYSQL_DB",
                    valueFrom= "arn:aws:secretsmanager:ap-northeast-2:${var.account_id}:secret:mysql_env-atY20C:MYSQL_DB::"
                    secretOptions = [
                      {
                        name  = "AutomationLambdaInvoke"
                        value = "Disabled"
                      }
                    ]
                }
        ]
      }
    ]
  )

}

