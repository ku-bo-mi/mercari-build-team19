from contextlib import closing

import sqlite3

# file path of the database

filename = '../db/mercari.sqlite3'

# initial data for items
default_items = []
default_items.append(["FUJIFILM X-T200", "Camera", "67d2a84b163715a02682da40b684bfeea0f8e4f3af8ac16be26f31e5fc0b4243.jpg"])
default_items.append(["ROLLEIFLEX 35F", "Camera", "cbbf73da13f828290be741bd6dce11ffa7d2c12ad98823f2c790fb964db9ff4c.jpg"])
default_items.append(["THEORY Backpack 100B", "Bag", "c9b4321aed11385c86310b168b7f55b0c79031c7d7106691b16ea810d4a4e700.jpg"])
default_items.append(["KODAK Pony 858", "Camera", "509f7c2258386e41a1390a5421d76174592088463989fdf1cbe5e3baad10fd3b.jpg"])
default_items.append(["FUJIFILM 35mm Film", "Camera", "17da6602b67ddc1b9c8c377d73476697bf0b8d65371e23632decb5b8848f5592.jpg"])

# initial data for requests
default_requests = []
default_requests.append(["FUJIFILM X-T100", "Camera", "b99c569d867bbb8cb316d4a46f0dcc713c5b69b2f7845324a26775a071139392.jpg"])
default_requests.append(["KODAK 35mm Film", "Camera", "22a908e8f9b7548c44c98fca526e382f9d8000828c76b4a494f4c8fef5bd0f76.jpg"])
default_requests.append(["CANON TL-1", "Camera", "003271552639672da51603adf5a60e8e784b3491bda0eb02fcf6b55c941dd023.jpg"])

"""
Creates database
"""


def create_tables():
    with closing(sqlite3.connect(filename)) as db_connect:

        # drop tables if exits
        db_cursor = db_connect.cursor()
        sql = """DROP TABLE IF EXISTS requests"""
        db_cursor.execute(sql)

        sql = """DROP TABLE IF EXISTS items"""
        db_cursor.execute(sql)

        # create new tables
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
Sets initial data to tables
"""
def add_data_to_tables():
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        
        for item in default_items:
            sql = 'INSERT INTO items(name, category, image) values (?, ?, ?)'
            data = item
            db_cursor.execute(sql, data)

        for request in default_requests:
            sql = 'INSERT INTO requests(name, category, image) values (?, ?, ?)'
            data = request
            db_cursor.execute(sql, data)

        db_connect.commit()
    return

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
