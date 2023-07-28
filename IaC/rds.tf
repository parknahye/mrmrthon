resource "aws_db_instance" "marathon-user-db-tf" {
    engine               = "mysql"
    identifier           = "marathon-user-db-tf"
    allocated_storage    =  20
    engine_version       = "8.0.32"
    instance_class       = "db.t2.micro"
    username             = var.username
    password             = var.password
    parameter_group_name = "default.mysql8.0"
    db_subnet_group_name = aws_db_subnet_group.final_subnet_group_tf.id
    vpc_security_group_ids = [aws_security_group.final_sg_by_tf.id]  # 동일한 VPC에 있는 EC2 보안 그룹 사용
    skip_final_snapshot  = true
    publicly_accessible =  false
    db_name = "user_db"
}
