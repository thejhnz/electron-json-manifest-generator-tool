   var path = require("path");

   const remote = require('electron').remote;
   const { dialog } = require('electron').remote;

   const fs = require('fs');

   document.getElementById("open-dir").addEventListener("click", function(e) {

       dialog.showOpenDialog({ properties: ['openDirectory'] }, function(directory) {

           const manifestDirectory = directory.toString() + '';

           console.log(manifestDirectory);

           // List all files in a directory in Node.js recursively in a synchronous fashion
           var walkSync = function(dir, filelist) {
               var path = path || require('path');
               var fs = fs || require('fs'),
                   files = fs.readdirSync(dir);
               filelist = filelist || [];
               files.forEach(function(file) {
                   if (fs.statSync(path.join(dir, file)).isDirectory()) {
                       filelist = walkSync(path.join(dir, file), filelist);
                   } else {
                       filelist.push(path.join(dir, file).replace(manifestDirectory, ""));
                   }
               });
               return filelist;
           };

           const manifest = JSON.stringify(walkSync(manifestDirectory));

           console.log(manifest);

           document.getElementById("manifest").value = manifest;

           fs.writeFile("manifest.json", manifest, function(err) {

               if (err) {
                   return console.log(err);
               }

               alert("manifest.json file saved");
               console.log("The file was saved!");
           });

       });

   });