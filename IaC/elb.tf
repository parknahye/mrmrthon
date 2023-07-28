resource "aws_lb" "marathon-user-alb-tf" {
  name               = "marathon-user-alb-tf"
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_subnet_1_by_tf.id, aws_subnet.public_subnet_2_by_tf.id]
  security_groups    = [aws_security_group.final_sg_by_tf.id]
}

resource "aws_lb" "marathon-main-alb-tf" {
  name               = "marathon-main-alb-tf"
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_subnet_1_by_tf.id, aws_subnet.public_subnet_2_by_tf.id]
  security_groups    = [aws_security_group.final_sg_by_tf.id]
}

resource "aws_lb_listener" "marathon-user-tf" {
  load_balancer_arn = aws_lb.marathon-user-alb-tf.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.marathon-user-tg-tf.arn
    type             = "forward"
  }
}

resource "aws_lb_listener" "marathon-main-tf" {
  load_balancer_arn = aws_lb.marathon-main-alb-tf.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.marathon-main-tg-tf.arn
    type             = "forward"
  }
}

