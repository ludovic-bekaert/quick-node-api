# QUICK NODE API

## Starting
Run `npm run start` to run the fake api.

## Config
### Endpoints
You can add endpoint to the API by adding them to the `api/_faker.json` file.

You can define the request method, the url, the request body and the request response based on various scenarios.

``` json
demoFakeLogin: {
  "method": "POST",
  "url": "/login",
  "request": {
    "body": {
      "email": "email|required",
      "password": "string|required"
    }
  },
  "response": {
    "success": {
      "status": 204,
      "headers": {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
      }
    }
  }
}
```

### Method
The method can by `GET`, `POST`, `PUT` and `DELETE`. The `PATCH` method isn't supported for the moment.
### Url
You can use dynamique attributes by using this syntax `:myAttributes`.
You can validate those attributes in the request property.
### Request
The request is used for the validation. The validation is separated into two objects: `body` and `attributes`. As you may guess, they respectively validate the request body and the request attributes.

## Validation
Here is the list of the validation options
| Key         | Description                             |
| ----------- | --------------------------------------- |
| email       | Check if the variable is a valid email  |
| required    | The variable is mandatory               |
| string      | Check if the variable is a string       |

Upcoming validation options
| Key         | Description                              |
| ----------- | ---------------------------------------- |
| boolean     | Check if the variable is a boolean       |
| enum:value1,value2,..        | Check if the variable value is in a givent list |
| exist:table       | Check if object exists in the DB         |
| file        | Check if the variable is a file          |
| number      | Check if the variable is a number        |
| unique:table      | Check if the variable value is unique in the DB |
