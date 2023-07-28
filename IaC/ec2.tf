#EC2 생성
resource "aws_instance" "grafana-tf" {
    ami = "ami-0c9c942bd7bf113a2"
    instance_type = "t2.micro"
    security_groups = [aws_security_group.final_sg_by_tf.id]
    subnet_id =  aws_subnet.public_subnet_1_by_tf.id
    key_name = "test_key"
    associate_public_ip_address = true
    user_data = <<-EOF
      #!/bin/bash
      sudo apt-get update
      sudo apt-get install -y docker.io
      sudo docker run -d --name=grafana -p 3000:3000 grafana/grafana
      EOF

    tags = { 
        Name = "grafana-tf"
        Terraform   = "true"
        Environment = "dev"    }
}

