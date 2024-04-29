# Github Repo

https://github.com/TimelabVZW/Buurtsporen

# Env files

## Frontend env variables

- VITE_BACKEND_URL (link naar waar de api/bakcend gehost word. ex. http://localhost:3000)

## Backend env variables

- AWS_ACCESS_KEY_ID (IAM user acces key id)
- AWS_SECRET_ACCESS_KEY (IAM user secret access key)
- AWS_REGION (region your bucket is hosted in)

- S3_BUCKET_NAME ( name defined to your bucket on S3)

- DATABASE_URL ( link to your database ex. postgres://myuser:mypassword@localhost:5432/mydatabase)

# Nodige mutation voor een user te maken:

invoeren in DATABASE_URL/graphql

mutation CreateUser {
  createUser(
    createUserInput: { email: "test@test.test", password: "test123" }
  ) {
    id
    email
    password
  }
}


credentials:

email: "test@test.test"
password: "test123"
