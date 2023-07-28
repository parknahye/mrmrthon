resource "aws_lb_target_group" "marathon-user-tg-tf" {
  name        = "marathon-user-tg-tf"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.final-vpc-by-tf.id

  target_type = "ip"
}

resource "aws_lb_target_group" "marathon-main-tg-tf" {
  name        = "marathon-main-tg-tf"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.final-vpc-by-tf.id

  target_type = "ip"
}