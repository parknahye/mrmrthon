# cluster
resource "aws_ecs_cluster" "marathon_cluster_tf" {
  name = "marathon_cluster_tf"
}

# service
# user
resource "aws_ecs_service" "marathon_user_service_tf" {
  name            = "marathon_user_service_tf"
  cluster         = aws_ecs_cluster.marathon_cluster_tf.id
  task_definition = aws_ecs_task_definition.user_server_task_definition_tf.id
  enable_execute_command = true
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = [aws_subnet.public_subnet_1_by_tf.id, aws_subnet.public_subnet_2_by_tf.id]
    security_groups = [aws_security_group.final_sg_by_tf.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.marathon-user-tg-tf.arn
    container_name = "user_server_container_tf"
    container_port = 9000
  }

  lifecycle {
    ignore_changes = [
      task_definition,
      desired_count,
      load_balancer
    ]
  }
}

# main
resource "aws_ecs_service" "main_service_tf" {
  name            = "marathon_main_service_tf"
  cluster         = aws_ecs_cluster.marathon_cluster_tf.id
  task_definition = aws_ecs_task_definition.main_server_task_definition_tf.id
  enable_execute_command = true
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = [aws_subnet.public_subnet_1_by_tf.id, aws_subnet.public_subnet_2_by_tf.id]
    security_groups = [aws_security_group.final_sg_by_tf.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.marathon-main-tg-tf.arn
    container_name = "main_server_container_tf"
    container_port = 9000
  }

  lifecycle {
    ignore_changes = [
      task_definition,
      desired_count,
      load_balancer
    ]
  }

}
