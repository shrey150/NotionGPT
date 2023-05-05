# curl 'https://api.notion.com/v1/pages/4f90d96a51ad4b2f9686ffcef3011784' \
#       -H 'Notion-Version: 2022-06-28' \
#       -H 'Authorization: Bearer '""''
import os
from notion_client import Client
from dotenv import load_dotenv
from pprint import pprint

load_dotenv()

PAGE_ID_ROOT = os.environ['PAGE_ID_ROOT']
notion = Client(auth=os.environ['NOTION_API_KEY'])

block = notion.blocks.children.list(PAGE_ID_ROOT)
with open('dump.json', 'w') as dump:
    dump.write(str(block))