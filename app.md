# Github Repo

https://github.com/pgm-stefdebo3/Timelab-project/tree/main


# Deploy link

Al eerder naar Philippe gestuurd dat ik geen access heb naar de server van Timelab omdat ze net met verlof zijn, ik kan het niet echt ergens anders deployen omdat ik Multer gebruik en veel gratis deployers hebben daar problemen mee + mono-repo kan ik niet meer op huroku zetten aangezien dit betalend is

# Nodige mutation voor een user te maken:

invoeren in https://api.buurtsporen.be/graphql

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
