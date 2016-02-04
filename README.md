
# Endpoints:
- `POST /metadata/ocp/set/`

 **Post JSON (from the request `data`).** You *must* specify a `token` key and give it a value in your metadata.

 If you don't specify a `secret` in your POST request, this data will be read-only. In order to edit your data, you must specify a `secret`. (One of the keys in your metadata should be `secret`, and its value can be any string that you'll remember. Anyone with this `secret` can edit the entry.

 **Keys**
 - Required

  | Key | Value | Description |
  |-----|-------|-------------|
  | `token` | String | The token that this datum corresponds to in OCP. |

 - Optional

  | Key | Value | Description |
  |-----|-------|-------------|
  | `secret` | String | Pick a secret word. You can use it later to edit this datum. If you don't supply a `secret`, this metadata will be read-only. |


 **Responses:**

 | Code | Message | Meaning |
 |------|---------|---------|
 | 200  | `[id]`  | Successful `set` performed. (`id` of the upserted object is returned.) |
 | 500  | `Metadata for token [token] is read-only.` | This data already exists and cannot be edited because no `secret` was defined. |
 | 500  | `Metadata for token [token] cannot be updated: Bad secret.` | This data already exists, and the `secret` you specified in your request didn't match the `secret` required to edit the datum. |
 | 500  | `Metadata for token [token] could not be inserted.` | Unknown database error. |

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

Full setup from scratch, to running this service as a development server (on Ubuntu):

```
sudo apt-get install nodejs
curl https://install.meteor.com | sh
git clone git@github.com:openconnectome/ndlims.git ndlims
cd ndlims
meteor --port=3030
```
