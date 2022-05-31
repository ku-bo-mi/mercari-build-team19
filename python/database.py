from contextlib import closing

import sqlite3

# file path of the database

filename = '../db/mercari.sqlite3'

# initial data for items
default_items = []
default_items.append(
    ["FUJIFILM X-T200", "Camera", "67d2a84b163715a02682da40b684bfeea0f8e4f3af8ac16be26f31e5fc0b4243.jpg"])
default_items.append(
    ["ROLLEIFLEX 35F", "Camera", "cbbf73da13f828290be741bd6dce11ffa7d2c12ad98823f2c790fb964db9ff4c.jpg"])
default_items.append(
    ["THEORY Backpack 100B", "Bag", "c9b4321aed11385c86310b168b7f55b0c79031c7d7106691b16ea810d4a4e700.jpg"])
default_items.append(
    ["KODAK Pony 858", "Camera", "509f7c2258386e41a1390a5421d76174592088463989fdf1cbe5e3baad10fd3b.jpg"])
default_items.append(
    ["FUJIFILM 35mm Film", "Camera", "17da6602b67ddc1b9c8c377d73476697bf0b8d65371e23632decb5b8848f5592.jpg"])

# initial data for requests
default_requests = []
default_requests.append(
    ["FUJIFILM X-T100", "Camera", "b99c569d867bbb8cb316d4a46f0dcc713c5b69b2f7845324a26775a071139392.jpg", "126"])
default_requests.append(
    ["KODAK 35mm Film", "Camera", "22a908e8f9b7548c44c98fca526e382f9d8000828c76b4a494f4c8fef5bd0f76.jpg", "481"])
default_requests.append(
    ["CANON TL-1", "Camera", "003271552639672da51603adf5a60e8e784b3491bda0eb02fcf6b55c941dd023.jpg", "72"])

"""
Creates database
"""


def create_tables():
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        sql = """CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        name STRING,
        category_id INTEGER,
        image STRING,
        status_id INTEGER,
        numOfViews INTEGER,
        FOREIGN KEY(category_id) REFERENCES categories(category_id),
        FOREIGN KEY (status_id) REFERENCES status(status_id)
        )"""
        db_cursor.execute(sql)
        sql = """CREATE TABLE IF NOT EXISTS categories (
                category_id INTEGER PRIMARY KEY ,
                name STRING UNIQUE
                )"""
        db_cursor.execute(sql)
        sql = """CREATE TABLE IF NOT EXISTS status (
                status_id  INTEGER PRIMARY KEY,
                name STRING UNIQUE
        )"""
        db_cursor.execute(sql)
        requests = db_cursor.fetchall()
        db_connect.commit()
    return requests


"""
Returns the list of all items in the database
"""


def get_items(status_id=None):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row
        sql = """SELECT items.id,
                items.name,
                categories.name as category,
                items.image,
                items.numOfViews as numOfRequests,
                status.name as status
                FROM items
                INNER JOIN categories ON items.category_id =categories.category_id
                INNER JOIN status ON items.status_id = status.status_id
                WHERE status.status_id =(?)
                """
        db_cursor.execute(sql, (status_id,))
        items = db_cursor.fetchall()
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in items]

        db_connect.commit()
        return {'items': r} if r else {'message': 'No data found m(_ _)m'}


"""
Get recommend requests based on the listing history
"""

def get_recommend_requests():
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row

        # get all category from listed items, find whichone is the most
        sql = """SELECT items.category_id,
                categories.name as category,
                status.status_id as status FROM items
                INNER JOIN categories
                ON categories.category_id = items.category_id
                INNER JOIN status ON items.status_id = status.status_id
                WHERE status.status_id = 1
                """
        db_cursor.execute(sql)
        cate = db_cursor.fetchall()
        most_cate = max(cate, key=cate.count)[1]
        sql_request = """SELECT items.id,
                items.name,
                categories.name as category,
                items.image,
                items.numOfViews as numOfRequests,
                status.name as status
                FROM items
                INNER JOIN categories ON items.category_id =categories.category_id
                INNER JOIN status ON items.status_id = status.status_id
                WHERE status.status_id = 2 AND categories.name =(?)"""
        db_cursor.execute(sql_request, (most_cate,))
        recommend_requests = db_cursor.fetchall()
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in recommend_requests]

        db_connect.commit()
        return {'items': r} if r else {'message': 'No data found m(_ _)m'}

"""
Search item with the given id
Return the item if present, return None otherwise
"""


def get_item_by_id(item_id, status_id=None):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row
        sql = """SELECT items.id,
                items.name,
                categories.name as category,
                items.image,
                items.numOfViews,
                status.name as status
                FROM items
                INNER JOIN categories ON items.category_id =categories.category_id
                INNER JOIN status ON items.status_id = status.status_id
                WHERE items.id=(?) AND status.status_id =(?)"""
        data = (item_id, status_id)
        db_cursor.execute(sql, data)
        item = db_cursor.fetchall()
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in item]
        db_connect.commit()
        return {'items': r} if r else {'message': 'Item not found m(_ _)m'}


"""
Add a new item with the given name, category and image to the database
"""


def add_item(name, category, image_hash, status_id=None):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_cursor.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (category.capitalize(),))
        db_cursor.execute("SELECT category_id FROM categories WHERE name=(?)", (category.capitalize(),))
        category_id = db_cursor.fetchone()[0]
        sql = 'INSERT INTO items(name, category_id, image,numOfViews,status_id) VALUES (?, ?, ?, ?, ?)'
        data = (name, category_id, image_hash, 10, status_id)
        db_cursor.execute(sql, data)
        if status_id == 1:
            db_cursor.execute("INSERT OR IGNORE INTO status (name) VALUES (?)", ('on_List',))
        if status_id == 2:
            db_cursor.execute("INSERT OR IGNORE INTO status (name) VALUES (?)", ('on_Request',))
        db_connect.commit()


"""
Search items with the given string keyword from the database.
Returns the list of items where its name contains the keyword.
"""


def search_items(keyword, status_id=None):
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        db_connect.row_factory = sqlite3.Row
        sql = """SELECT items.id,
                items.name,
                categories.name as category,
                items.image,
                items.numOfViews,
                status.name as status
                FROM items
                INNER JOIN categories ON items.category_id =categories.category_id
                INNER JOIN status ON items.status_id = status.status_id
                WHERE items.name LIKE (?) AND status.status_id =(?)"""
        data = (('%' + keyword + '%'), status_id)
        db_cursor.execute(sql, data)
        items = db_cursor.fetchall()
        print(items)
        r = [dict((db_cursor.description[i][0], value)
                  for i, value in enumerate(row)) for row in items]
        db_connect.commit()

        return {'items': r} if r else {'message': 'Item not found m(_ _)m'}


def add_views():
    with closing(sqlite3.connect(filename)) as db_connect:
        db_cursor = db_connect.cursor()
        sql = """UPDATE items SET numOfViews = numOfViews+1"""
        db_cursor.execute(sql)
        db_connect.commit()
