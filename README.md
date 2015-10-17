
# Endpoints:
- `POST /metadata/ocp/set/:token`
  Post JSON (from the request `data`). If `token` is set in the data, *it will be overwritten by the URL-specified token.*
- `GET /metadata/ocp/get/:token`
  Get the JSON metadata associated with a token.



'/api/metadata/get/:id'
'/api/metadata/delete/:id/'
'/api/metadata/unset/:id/:field_name'
'/api/metadata/set/:id/:field_name'
'/api/metadata/exists/:field_name'
'/api/metadata/get'
'/api/metadata/set'

# Setup

Full setup from scratch, to running this service (on Ubuntu):

```
sudo apt-get install nodejs
wget https://install.meteor.com | sh
git clone git@github.com:j6k4m8/ocpmeta.git ocpmeta
cd ocpmeta
meteor --port=3030
```
