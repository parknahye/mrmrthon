resource "aws_cloudwatch_log_group" "user_server_task_definition_log_group" {
  name = "user_server_task_definition_log_group"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "main_server_task_definition_log_group" {
  name = "main_server_task_definition_log_group"
  retention_in_days = 7
}
