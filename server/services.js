

	
db.query('FOR d IN firstCollection SORT d.value ASC RETURN d._key').then(
  cursor => cursor.all()
).then(
  keys => console.log('All keys:', keys.join(', ')),
  err => console.error('Failed to execute query:', err)
);



	
collection.remove('firstDocument').then(
  () => console.log('Document removed'),
  err => console.error('Failed to remove document', err)
);