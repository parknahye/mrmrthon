### ECR
resource "aws_ecr_repository" "user_server_ecr-tf" {
  name         = "user_server_ecr-tf"
  force_delete = true
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "main_server_ecr-tf" {
  name         = "main_server_ecr-tf"
  force_delete = true
  image_scanning_configuration {
    scan_on_push = true
  }
}



# 이미지 빌드, 푸시
resource "null_resource" "build_and_push_image_user_server" {
  # provisioner "local-exec" {
  #   command = "docker build -t user_server_img:latest ../user_server/"
  # }

  provisioner "local-exec" {
    command = "aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${aws_ecr_repository.user_server_ecr-tf.repository_url}"
  }

  provisioner "local-exec" {
    command = "docker build -t ${aws_ecr_repository.user_server_ecr-tf.repository_url}:latest ../user_server/"
  }

  provisioner "local-exec" {
    command = "docker push ${aws_ecr_repository.user_server_ecr-tf.repository_url}:latest"
  }
}

resource "null_resource" "build_and_push_image_main_server" {
  # provisioner "local-exec" {
  #   command = "docker build -t user_server_img:latest ../user_server/"
  # }

  provisioner "local-exec" {
    command = "aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${aws_ecr_repository.main_server_ecr-tf.repository_url}"
  }

  provisioner "local-exec" {
    command = "docker build -t ${aws_ecr_repository.main_server_ecr-tf.repository_url}:latest ../user_server/"
  }

  provisioner "local-exec" {
    command = "docker push ${aws_ecr_repository.main_server_ecr-tf.repository_url}:latest"
  }
}