resource "aws_dynamodb_table" "official_record_tf" {
 name = "official_record_tf"
 billing_mode = "PROVISIONED"
 read_capacity= "30"
 write_capacity= "30"
 attribute {
  name = "id"
  type = "N"
 }
 hash_key = "id"
}

resource "aws_dynamodb_table" "non_official_record_tf" {
 name = "non_official_record_tf"
 billing_mode = "PROVISIONED"
 read_capacity= "30"
 write_capacity= "30"
 attribute {
  name = "id"
  type = "N"
 }
 hash_key = "id"
}


resource "aws_dynamodb_table" "official_marathon_tf" {
 name = "official_marathon_tf"
 billing_mode = "PROVISIONED"
 read_capacity= "30"
 write_capacity= "30"
 attribute {
  name = "id"
  type = "N"
 }
 hash_key = "id"
}


resource "aws_dynamodb_table" "palyer_tf" {
 name = "palyer_tf"
 billing_mode = "PROVISIONED"
 read_capacity= "30"
 write_capacity= "30"
 attribute {
  name = "id"
  type = "N"
 }
 hash_key = "id"
}