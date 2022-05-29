from contextlib import closing

import sqlite3

# file path of the database

filename = '../db/mercari.sqlite3'

"""
Creates database
"""


def create_tables():
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        sql = """CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name STRING, 
        category STRING,
         image STRING)"""
        db_cursor.execute(sql)
        sql = """CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name STRING, 
                category STRING, 
                image STRING)"""
        db_cursor.execute(sql)
        requests = db_cursor.fetchall()
        db_connect.commit()
    return requests


"""
Returns the list of all items in the database
"""


def get_items():
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row
        sql = 'SELECT * FROM items'
        db_cursor.execute(sql)
        items = db_cursor.fetchall()
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in items]

        db_connect.commit()
        return {'items': r} if r else {'message': 'No data found m(_ _)m'}


"""
Search item with the given id
Return the item if present, return None otherwise
"""


def get_id_by_id(item_id):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row
        sql = 'SELECT * FROM items WHERE id = ?'
        data = (item_id,)
        db_cursor.execute(sql, data)
        item = db_cursor.fetchall()
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in item]
        db_connect.commit()
        return {'items': r} if r else {'message': 'Item not found m(_ _)m'}


"""
Add a new item with the given name, category and image to the database
"""


def add_item(name, category, image_hash):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        sql = 'INSERT INTO items(name, category, image) values (?, ?, ?)'
        data = [name, category, image_hash]
        db_cursor.execute(sql, data)
        db_connect.commit()


"""
Search items with the given string keyword from the database.
Returns the list of items where its name contains the keyword.
"""


def search_items(keyword):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row
        sql = 'SELECT * FROM items WHERE name LIKE ?'
        data = ('%' + keyword + '%',)
        db_cursor.execute(sql, data)
        items = db_cursor.fetchall()
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in items]
        db_connect.commit()

        return {'items': r} if r else {'message': 'Item not found m(_ _)m'}


"""
Returns the list of all items in the database
"""


def get_requests():
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row
        sql = 'SELECT * FROM requests'
        db_cursor.execute(sql)
        requests = db_cursor.fetchall()
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in requests]
        db_connect.commit()

        return {'items': r} if r else {'message': 'Request not found m(_ _)m'}


"""
Add a new request with the given name, category and image to the database
"""


def add_request(name, category, image_hash):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        sql = 'INSERT INTO requests(name, category, image) values (?, ?, ?)'
        data = [name, category, image_hash]
        db_cursor.execute(sql, data)
        db_connect.commit()
