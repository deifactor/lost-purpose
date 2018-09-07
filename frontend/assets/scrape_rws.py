# Scrapes all of the Tarot images to the directory given as its argument.
import bs4
import os
import requests
import sys

URL = "http://muzendo.jp/blog/?p=19"
SUITS = ["wands", "cups", "swords", "pents"]

def get_image_urls(html):
    urls = {}
    images = [link.get('href') for link in html.find(class_="entry-content").find_all("a")
              if link.get('href').startswith('http://blogimg.goo.ne.jp')]
    if len(images) != 22 + 14 * 4 + 1:
        raise ValueError("Wrong number of images {}: {}".format(len(images), images))
    # The second one is the card back.
    urls["00"] = images[0]
    urls["back"] = images[1]
    for i in range(1, 22):
        urls["{:02}".format(i)] = images[i + 1]
    for suit in SUITS:
        offset = len(urls)
        for i in range(1, 15):
            urls["{:02}-{}".format(i, suit)] = images[offset + i - 1]

    return urls


if __name__ == "__main__":
    output_dir = sys.argv[1]
    html = bs4.BeautifulSoup(requests.get(URL).content, features="html.parser")
    for name, url in get_image_urls(html).items():
        path = os.path.join(output_dir, "{}.jpg".format(name))
        print("Saving {} to {}".format(url, path))
        response = requests.get(url)
        if response.status_code == 200:
            with open(path, "wb") as f:
                f.write(response.content)
        else:
            print("Error {}".format(response.status_code))
