A small *hello-world* introductionary tutorial for the [ember-light-table]((http://offirgolan.github.io/ember-light-table/) addon
## Introduction
Ember-light-table is a great tool for creating nice tables in emberjs.
Unfortunately people, myself included, seem to struggle at the beginning and a little
guidance seems appropriate.
To ease their pain I created a little "hello-world" like example, based the
[ember tutorial series](https://guides.emberjs.com/release/tutorial/ember-cli/)
and the [ember-light-table doc](http://offirgolan.github.io/ember-light-table/docs/).

This tutorial was created with
* ember-cli: 3.1.4
* ember-light-table: v1.12.1

:warning: Before going on, be sure to finish the [ember tutorial series](https://guides.emberjs.com/release/tutorial/ember-cli/).
Here, we will spell out some of the basic steps as well, but it's highly encouraged
to get an overview of the different concepts and names in ember beforehand.

:warning: :warning: This example is designed as a *code-along*.
This means that at certain times I will do not specify the file which needs modification or not the whole code is shown.
That way you have to do things on your own and start to form connections.
It is also written from the perspective of an emberjs newcomer and some things might seem trivial to you.

If you are feeling lost, just open this example with:
```
npm install
ember s
```
and dive into the part were you struggle. Good Luck!
## Description
### Basic idea
Assuming we are working on a big AAA game about little monsters which fight
each other, something with an arbitrary name *Kopemon*.
To describe the different monsters one can interact with, it seems a good idea to have a dictionary web-app where you can browse all the different monsters and look up their stats.

Before we start, let's  define what kind of data each *Kopemon* needs to have and what we want to show:
* An Id/Name
* A type
* Health points
* What is its weakness
* An image for the monster

Everything should fit in a table, the image should be shown as well and if you
click on a row, details like the weakness of the monster have to be presented.

With that settled it is time to start the ember project!
### Start
#### Init your project:
First create a new emberjs project
```
ember new kopemon
```
and replace the contents of the index app/templates/application.hbs with:

```html
<h1> Kopemon - encyclopedia </h1>
<h2> A nice encyclopedia about nice little monsters </h2>
{{outlet}}
```
If you now visit http://localhost:4200/ you should see your *Kopemon - encyclopedia*
#### Create a route:
Next, create a route to the actual encyclopedia part of your webapp.
This isn't absolutely necessary for that example, but good practice to keep things distinguished
```
ember generate route encyclopedia
```
and update the template templates/encyclopedia.hbs
```html
<h3>Here we need an ember-light-table!</h3>
```
You can now visit your new router under: http://localhost:4200/encyclopedia
and should see:
![route_example]( https://github.com/Stoiker/ember-light-table-hello-world/blob/master/img/route.png "Route result without table")

### First steps with ember-light-table
#### Install the addon:
```
ember install ember-light-table
```
and take a look at the docs: http://offirgolan.github.io/ember-light-table/docs/modules/Usage.html

To be on the safe side, restart your ember server.

#### Define a data storage:

First, we need to generate a location were data that will be shown in our table will be stored.
Following the [ember tutorial series]("https://guides.emberjs.com/release/tutorial/model-hook/"), we are going to hard-code the data into the app/routes/encyclopedia.js.
Add the model() into 	**export default Route.extend** :
```javascript
export default Route.extend({
  model() {
	   return [];
	}
});
```
For the time being this model will stay empty. In a couple of minutes it will get
populated.

Needless to say one can use something more *real-life* in terms of data handling, e.g. *ember-cli-mirage* or a proper backend with an ember adapter. Feel free to do so!

#### Create a component & table:
Next we need a component that will provide our *ember-light-table*:
```
ember g component kopemon-table
```
Now for the fun part, defining the underlying shape of our table.
We are going to follow [ember-light-docs]("http://offirgolan.github.io/ember-light-table/docs/modules/Table%20Declaration.html") and add the following to app/components/kopemon-table.js:
```javascript
export default Component.extend({
	  columns: computed(function() {
	    return [ {
	      label: 'Id',
	      valuePath: 'id',
	      width: '150px'
	    }, {
	      label: 'Type',
	      valuePath: 'type',
	      width: '150px'
	    }, {
	      label: 'Hit-Points',
	      valuePath: 'healthpoints',
	      width: '150px'
	    }
	  ];
	  }),

	  table: computed('model', function() {
	   return new Table(this.get('columns'), this.get('model'));
	  })

  });
```
As you might have already guessed the columns are the important part here.
It provides a list of columns which consists of
  * label: The actual name of the column displayed to the user.
  * valuePath: The name of the property inside the model that has to be shown in
    the table.
  * width: The width of the column rendering.

Please mind the last column *Hit-Points*, which illustrates that the property name
and column name do not (!) have to be the same.

That will define our table, but does not show it to the user (check it!).
As you know we need to place its rendering into an hbs-file.
Replace the content of app/templates/components/kopemon-table.hbs with:
```javascript
{{#light-table table as |t|}}
	  {{t.head}}
	  {{#t.body as |body|}}{{/t.body}}
{{/light-table}}
```
which is ~~the bare-minimum~~ almost the bare-minimum for an *ember-light-table*.
  * {{t.head}} displays the column headers
  * {{/t.body}}

To conclude the rendering part, we need to include the component into our route.
Replace the contents of app/templates/encyclopedia.hbs with:
```javascript
{{kopemon-table}}
```
and visit your app. The result:  
![Table_1](https://github.com/Stoiker/ember-light-table-hello-world/blob/master/img/table_1.png "Initiated ember-light-table without content")
As expected the table is empty, but the columns are shown.
(As an exercise to the reader: Remove the header from the table and check the result.)

Next step: Show a nice "No-content here" message.
#### Show text for empty table:
To show a nice message, alter your table template with the following:
```javascript
{{#light-table table as |t|}}
  {{t.head}}
  {{#t.body as |body|}}
    {{#if table.isEmpty}}
      {{#body.no-data}}
        No kopemons are found ;-(
      {{/body.no-data}}
    {{/if}}
  {{/t.body}}
{{/light-table}}
```

It is that easy. Recheck your app!
![Table_2]( https://github.com/Stoiker/ember-light-table-hello-world/blob/master/img/table_2.png "Initiated ember-light-table without content but an empty-data message.")

Time for **real** data!

#### Populate your model:
As stated above, we will hard-code our dataset into the route.
Replace your empty model in app/routes/encyclopedia.js with:
```javascript
model() {
  return [{
    id: 'Quarkos',
    type: 'Water',
    healthpoints: 12,
    weakness:'Fire',
    picture: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/3195dialock.png',
  },
  {
    id: 'Gaeas',
    type: 'Earth',
    healthpoints: 15,
    weakness:'Water',
    picture: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Amelie_300dpi.png',
  }, {
    id: 'Lightos',
    type: 'Fire',
    healthpoints: 9,
    weakness:'Earth',
    picture: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Devil_cartoon_charactor.png',
  }];
}
```
Please don't mind the names and images, I was just lazy.
Replace it with content of your choice!
Again, we used the same property names as stated in app/components/kopemon-table.js.

Ready? Set, go! Visit: http://localhost:4200/encyclopedia ... still no content in the data!?!

Of course not, we need to parse the model to our component
```javascript
{{kopemon-table model=model}}
```
Recheck! Congratulations, you populated your first ember-ligth-table! It should look
like this:
![Table_3]( https://github.com/Stoiker/ember-light-table-hello-world/blob/master/img/table_3.png "Initiated ember-light-table with content")

Great, but we are missing the images!

#### Include an image column:
The problem is that from the point of view of the table, our picture property is
only a piece of text.
We need to tell our table how to transfer that into something useful.
(Don't believe me? Create a new col. for the picture and check the result!)

Hence generate a new component "kopemon-avatar" and put
```html
<img src={{value}} width="50px" height="50px" />
```
into the template. You can properly guess what's the goal here: *ember-light-table*
substitute the path to the image,{{value}}, with each value of the picture property
of the model entries.

This new component can now be included in our table column list:
```javascript
...
{
  label: 'Picture',
  valuePath: 'picture',
  width: '150px',
  cellComponent: 'kopemon-avatar'
}
...
```
Recheck your app and you should see:
![Table_4]( https://github.com/Stoiker/ember-light-table-hello-world/blob/master/img/table_4.png "Ember-light-table with content and images")

:tada: We are pretty close to the [ember-light-table demo]("https://offirgolan.github.io/ember-light-table/") ! Good job!
The only thing left to do is the detail view, when the user clicks an row.

#### Expandable rows:
By reading the [doc for t.body]("http://offirgolan.github.io/ember-light-table/docs/classes/t.body.html")
one can spot the *canExpand* property, which will allow rows to be expanded.
Hence replace your template code with the following:
```javascript
{{#light-table table as |t|}}
  {{t.head}}
  {{#t.body canExpand=true as |body|}}

    {{#body.expanded-row as |row|}}
      {{row.id}} has only one weakness: <b>{{row.weakness}}</b>
    {{/body.expanded-row}}

    {{#if table.isEmpty}}
      {{#body.no-data}}
        No kopemons are found ;-(
      {{/body.no-data}}
    {{/if}}

  {{/t.body}}
{{/light-table}}
```
The property is set in:
```javascript
  {{#t.body canExpand=true as |body|}}
```
and what to render is defined in:
```javascript
    {{#body.expanded-row as |row|}}
      {{row.id}} has only one weakness: <b>{{row.weakness}}</b>
    {{/body.expanded-row}}
```
The row variable contains all the data from the current element of the model, which
also includes stuff thats not shown in a column!

Take a look at your app, click on a row and you will see the final result:
![Table_5](https://github.com/Stoiker/ember-light-table-hello-world/blob/master/img/table_5.png "Ember-light-table with content and images and expandable rows")

You can also include your table into the table, by using the expanded row. Try it!

That concludes the *hello-world* example and now you should be fit to dive into
more elaborate examples shown in the [demo]("https://offirgolan.github.io/ember-light-table/").

Happy Coding!
