

fs = require('fs')

fs.readFile("./mock_application.json", "utf8", (err, data) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  try {
    // Read the file and beging checking for duplicate fields
    const fileData = JSON.parse(data);
    const objects = fileData.versions[0].objects
    let cleanedData = [];

    // Loop over the objects and each objects fields
    for (let x = 0; x < objects.length; x++) {
      const tempArray = []; // create an array which will hold the non-duplicate fields
      const fields = objects[x].fields;
      for (let y = 0; y < fields.length; y++) { // Each object can have 1 or more duplicate fields
        const key = objects[x].fields[y].key; // Get the key to check for a duplicate of
        const dirtyField = tempArray.find(item => item.key == key); // Look to see if the key aready exists
        if (!dirtyField) { // If the key doesn't exist, add it to the temporary array
          tempArray.push(objects[x].fields[y])
        }
      }
      let newObject = { // create a new object with all the object data and non-duplicated fields.
        "inflections": objects[x].inflections,
        "connections": objects[x].connections,
        "user": objects[x].user,
        "status": objects[x].status,
        "tasks": objects[x].tasks,
        "type": objects[x].tasks,
        "_id": objects[x]._id,
        "name": objects[x].name,
        "fields": tempArray,
        "template": objects[x].template,
        "key": objects[x].key,
        "identifier": objects[x].identifier
        }
      cleanedData = cleanedData.concat(newObject);
    }
    
    const cleanData = JSON.stringify( // create the cleaned (non-duplicate) data to be written back to disk
      {
        "_id": fileData._id,
        "users": fileData.users,
        "ecommerce": fileData.ecommerce ,
        "counts": fileData.counts,
        "field_count" : fileData.field_count,
        "thumb_count" : fileData.thumb_count,
        "object_count" : fileData.object_count,
        "task_count" : fileData.task_count,
        "view_count" : fileData.view_count,
        "scene_count" : fileData.scene_count,
        "credential_count" : fileData.credential_count,
        "status" : fileData.status,
        "settings": fileData.settings,
        "tasks": fileData.tasks,
        "payment_processors": fileData.payment_processors,
        "design": fileData.design,
        "layout": fileData.layout,
        "copying": fileData.copying,
        "feature_flags": fileData.feature_flags,
        "name": fileData.name,
        "slug": fileData.slug,
        "distributions": fileData.distributions,

        "versions": 
          {
            "_id": + fileData.versions._id,
            "status": + fileData.versions.status,
            "objects": cleanedData,
          },
        "scenes": fileData.versions.scenes,
        "first_created": fileData.first_created,
        "account_id": fileData.account_id,
        "user_id": fileData.versions.user_id
      }, null, '\t')
  
    // write the corrected data to a json file on disk.
    fs.writeFile("./clean_application.json", cleanData, 'utf8', err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
    

  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});