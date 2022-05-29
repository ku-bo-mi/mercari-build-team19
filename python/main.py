import os
import logging
import pathlib

from sqlite3 import Error
from fastapi import FastAPI, Form, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import database
import hashlib

app = FastAPI()
logger = logging.getLogger("uvicorn")
logger.level = logging.INFO
images = pathlib.Path(__file__).parent.resolve() / "images"
origins = [os.environ.get('FRONT_URL', 'http://localhost:3000')]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# Creates and initialize tables
database.create_tables()
database.add_data_to_tables()

"""
Main page
"""


@app.get("/")
def root():
    return {"message": "Hello, world!"}


"""
Gets the list of all items
"""


@app.get("/items")
def read_items():
    # get the list of all items in the database
    try:
        items = database.get_items()
        # format the list and return
        return items
    except Error as e:
        logger.error(e)
        return {'message': f'{e}'}


"""
Gets item with the given item_id
"""


@app.get("/items/{item_id}")
async def get_item_by_id(item_id):
    try:
        item = database.get_id_by_id(item_id)
        return item
    except Error as e:
        logger.error(e)
        return {'message': f'{e}'}


"""
Creates a new item with the given name, cateogry, image
Accepts the arguments as File.
"""


@app.post("/items")
def add_item(name: bytes = File(...), category: bytes = File(...), image: bytes = File(...)):
    # cast bytes to string
    name = name.decode('utf-8')
    category = category.decode('utf-8')

    logger.info(f"Receive item: name = {name}, category = {category}")

    # save the bytes of the uploaded image file in "images" directory
    filename_hash = save_image(image)
    logger.info(f"Created file: {filename_hash}")

    # add a new item in the database with the hashed filename
    try:
        database.add_item(name, category, filename_hash)
        return {"message": f"item received: {name}"}
    except Error as e:
        logger.error(e)
        return {'message': f'{e}'}


@app.get("/search")
async def search_items(keyword: str):
    logger.info(f"Receive search_keyword: keyword = {keyword}")

    # get the list of items with name that contains the given keyword
    try:
        items = database.search_items(keyword)
        return items
    except Error as e:
        logger.error(e)
        return {'message': f'{e}'}


@app.get("/image/{image_filename}")
async def get_image(image_filename):
    # Create image path
    image = images / image_filename

    if not image_filename.endswith(".jpg"):
        raise HTTPException(status_code=400, detail="Image path does not end with .jpg")

    if not image.exists():
        logger.debug(f"Image not found: {image}")
        image = images / "default.jpg"

    return FileResponse(image)


"""
Saves the given bytes of the image file as a new file in "items" directory
Creates the hash from the given bytes and uses it as the filename
"""


def save_image(image_bytes):
    # hash the bytes with sha256, and put '.jpg' in the end
    filename_hash = hashlib.sha256(image_bytes).hexdigest() + '.jpg'

    # write the given bytes to a new file
    try:
        with open("images/" + filename_hash, "wb") as fout:
            fout.write(image_bytes)
            return filename_hash
    except Error as e:
        logger.error(e)


"""
Gets the list of all requests
"""


@app.get("/requests")
def read_requests():
    # get the list of all items in the database
    try:
        requests = database.get_requests()
    # format the list and return
        return requests
    except Error as e:
        logger.error(e)
        return {'message': f'{e}'}


"""
Creates a new requests with the given name, cateogry, image
Accepts the arguments as File.
"""


@app.post("/requests")
def add_item(name: bytes = File(...), category: bytes = File(...), image: bytes = File(default=None)):
    # cast bytes to string
    name = name.decode('utf-8')
    category = category.decode('utf-8')

    logger.info(f"Receive request: name = {name}, category = {category}")

    # if image is uploaded
    if image:
        # save the bytes of the uploaded image file in "images" directory
        filename_hash = save_image(image)
        logger.info(f"Created file: {filename_hash}")

    # if no image is uploaded
    else:
        filename_hash = ""

    # add a new item in the database with the hashed filename
    try:
        database.add_request(name, category, filename_hash)
        return {"message": f"item received: {name}"}
    except Error as e:
        logger.error(e)
        return {'message': f'{e}'}
