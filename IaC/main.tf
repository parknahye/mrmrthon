terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
     docker = {
      source = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region
}

provider "docker" {
}

# vpc 생성
resource "aws_vpc" "final-vpc-by-tf" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "final-vpc-by-tf"
  }
}

# vpc 내 서브넷 4개 생성 (퍼블릭 2개, 프라이빗 2개)
# 퍼블릭 서브넷 생성
resource "aws_subnet" "public_subnet_1_by_tf" {
  vpc_id     = aws_vpc.final-vpc-by-tf.id
  cidr_block = "10.0.0.0/20"
  availability_zone = "ap-northeast-2a"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "final-pub-sub-1-by-tf"
  }
}

resource "aws_subnet" "public_subnet_2_by_tf" {
  vpc_id     = aws_vpc.final-vpc-by-tf.id
  cidr_block = "10.0.16.0/20"
  availability_zone = "ap-northeast-2c"
  map_public_ip_on_launch = true

  tags = {
    Name = "final-pub-sub-2-by-tf"
  }
}

# 프라이빗 서브넷 생성
resource "aws_subnet" "private_subnet_1_by_tf" {
  vpc_id     = aws_vpc.final-vpc-by-tf.id
  cidr_block = "10.0.128.0/20"
  availability_zone = "ap-northeast-2a"

  tags = {
    Name = "final-prv-sub-1-by-tf"
  }
}

resource "aws_subnet" "private_subnet_2_by_tf" {
  vpc_id     = aws_vpc.final-vpc-by-tf.id
  cidr_block = "10.0.144.0/20"
  availability_zone = "ap-northeast-2c"

  tags = {
    Name = "final-prv-sub-2-by-tf"
  }
}

# 서브넷 그룹 설정
resource "aws_db_subnet_group" "final_subnet_group_tf" {
  name = "final_subnet_group_tf"
  
  subnet_ids = [aws_subnet.private_subnet_1_by_tf.id, aws_subnet.private_subnet_2_by_tf.id]
  
}

# IGW 생성
resource "aws_internet_gateway" "final-igw-by-tf" {
  vpc_id = aws_vpc.final-vpc-by-tf.id

  tags = {
    Name = "final-igw-by-tf"
  }
}

# 라우팅 테이블 생성
resource "aws_route_table" "pubroutetable-by-tf" {
  vpc_id = aws_vpc.final-vpc-by-tf.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.final-igw-by-tf.id
  }

  tags = {
    Name = "final-public-route-table-by-tf"
  }
}

# 라우팅 테이블 연결
resource "aws_route_table_association" "pubassociation1-by-tf" {
  subnet_id      = aws_subnet.public_subnet_1_by_tf.id
  route_table_id = aws_route_table.pubroutetable-by-tf.id
}

resource "aws_route_table_association" "pubassociation2-by-tf" {
  subnet_id      = aws_subnet.public_subnet_2_by_tf.id
  route_table_id = aws_route_table.pubroutetable-by-tf.id
}

# NGW 생성
resource "aws_eip" "eip-by-tf" {
  vpc   = true

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "eip-by-tf"
  }
}

resource "aws_nat_gateway" "ngw-by-tf" {
  allocation_id = aws_eip.eip-by-tf.id
  subnet_id = aws_subnet.public_subnet_1_by_tf.id

  tags = {
    Name = "final-ngw-by-tf"
  }
}

# 라우팅 테이블 생성
resource "aws_route_table" "prvroutetable-1-by-tf" {
  vpc_id = aws_vpc.final-vpc-by-tf.id

  tags = {
    Name = "final-prv-route-table-1-tf"
  }
}

resource "aws_route_table" "prvroutetable-2-by-tf" {
  vpc_id = aws_vpc.final-vpc-by-tf.id

  tags = {
    Name = "final-prv-route-table-2-tf"
  }
}

# 라우팅 테이블 연결
resource "aws_route_table_association" "prvassociation1-by-tf" {
  subnet_id      = aws_subnet.private_subnet_1_by_tf.id
  route_table_id = aws_route_table.prvroutetable-1-by-tf.id
}

resource "aws_route_table_association" "prvassociation2-by-tf" {
  subnet_id      = aws_subnet.private_subnet_2_by_tf.id
  route_table_id = aws_route_table.prvroutetable-2-by-tf.id
}

resource "aws_route" "prvroute-1-by-tf" {
  route_table_id         = aws_route_table.prvroutetable-1-by-tf.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.ngw-by-tf.id
}

resource "aws_route" "prvroute-2-by-tf" {
  route_table_id         = aws_route_table.prvroutetable-2-by-tf.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.ngw-by-tf.id
}