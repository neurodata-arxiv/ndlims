
# Endpoints:
- `POST /metadata/ocp/set/:token`
  **Post JSON (from the request `data`).** Even if `token` is set in the data, *ocpmeta will use the URL-specified token.*

  **Errors:**

  | Code | Message | Meaning |
  |------|---------|---------|
  | 200  | `[id]`  | Successful `set` performed. (`id` of the upserted object is returned.) |
  | 500  | `Metadata for token [token] already exists.` | This data already exists and cannot be edited because no `secret` was defined. |
  | 500  | `Metadata for token [token] already exists with a defined secret.` | This data already exists, and the `secret` you specified in your request didn't match the `secret` required to edit the datum. |

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
