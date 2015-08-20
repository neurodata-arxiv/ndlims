# ocpmeta
LIMS system


#Instructions
mongoDB cmd line instructions:

Viewing is super duper easy

`db.kki42.find()` means use the current db, collection kki42, find everything
`db.kki42.find({_id:5})` use current db, collection kki42, find document where `_id = 5`

using `.pretty()` on the end makes it much more readable, btw

Deleting is easy too.

`db.kki42.remove({_id:5})` removes document where `_id = 5` from current db, collection kki42

`db.kki42.remove()` REMOVES EVERYTHING so DON'T do this - but note that it won't remove the collection, just all the data inside (kind of useless)
        if you want to remove the collection, use `db.kki42.drop()` instead. you'll get a "true" once it's done.


Updating is kind of a pain in the butt. It's easy to overwrite a document if you forget to use the $set command:

1. to add a field:
 ```
 db.kki42.update({_id:5},{$set:{"test_field":"hello world!"})
 ```
 this will add "test_field to the document

 be aware that without the $set command:
 ```
 db.kki42.update({_id:5},{"test_field":"hello world!"})
 ```
 will overwrite everything in document where _id = 5 and put the red stuff as the new value

2. to remove a field:
 ```
 db.kki42.update({_id:5},{$unset:{"test_field":""})
 ```
 this will remove "test_field" from the document where _id = 5

3. to update multiple documents:
        have to use the $multi command:

 ```
 db.kki42.update({age:30}, {$set:{"test_field":"hello world!"}},{$multi:true})
 ```

4. to insert on update if no match found:
 ```
 db.kki42.update({age:30}, {$set:{"test_field":"hello world!"}},{$upsert:true})
 ```

 This will insert a new document if none that matches your criteria are found. Useful for data tracking over time.
