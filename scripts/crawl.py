import scrapetube
from youtubesearchpython import Channel
import json

i_am_a_database_trust_me_bro = []

api_key = "AIzaSyCSC-7XwUfeKJzbYW-7oGoFsXY6psv5ho4"


def download_playlist(playlist_id, tag_name, category):
    videos = scrapetube.get_playlist(playlist_id)

    for video in videos:
        video_id = video['videoId']
        title = video['title']['runs'][0]['text']
        length = video['lengthSeconds'] if 'lengthSeconds' in video else 0
        print(f"ID: {video_id} | Category: {category} | Playlist: {tag_name} | Title: {title}")
        i_am_a_database_trust_me_bro.append({"video_id": video_id, "title": title, "category": category, "tag": tag_name, "length": length})


def download_videos(youtube_id):
    videos = scrapetube.get_channel(youtube_id)

    for video in videos:
        video_id = video['videoId']
        title = video['title']['runs'][0]['text']
        length = 0
        n = next((x for x in i_am_a_database_trust_me_bro if x["video_id"] == video_id), None)
        if n is None:
            print(f"ID: {video_id} | Category: Uncategorized | Playlist: None | Title: {title}")
            i_am_a_database_trust_me_bro.append(
                {"video_id": video_id, "title": title, "category": "Uncategorized", "tag": "Uncategorized", "length": length})


def load_categories():
    with open("scripts/known_categories.json", "r") as f:
        categories = json.load(f)

    formatted_cats = {}
    for cat in list(categories.keys()):
        for plist in categories[cat]:
            formatted_cats[plist] = cat

    return formatted_cats


def add_playlist_to_categories(title):
    with open("scripts/known_categories.json", "r") as f:
        categories = json.load(f)

    if "uncategorized" in categories:
        categories["uncategorized"] = categories["uncategorized"] + [title]
    else:
        categories["uncategorized"] = [title]

    with open("scripts/known_categories.json", "w") as f:
        json.dump(categories, f, indent=4)

    print(f"Playlist '{title}' not found in known categories, added as uncategorized")
    return load_categories()


def run_all():
    funhaus = "UCboMX_UNgaPBsUOIgasn3-Q"

    channel = Channel(funhaus)
    playlists = [{"id": plist["id"], "title": plist["title"]} for plist in channel.result["playlists"]]
    while channel.has_more_playlists():
        channel.next()
        new_playlists = [{"id": plist["id"], "title": plist["title"]} for plist in channel.result["playlists"]]
        for plist in new_playlists:
            if plist not in playlists:
                playlists.append(plist)

    categories = load_categories()

    for plist in playlists:
        if plist["title"] not in categories:
            categories = add_playlist_to_categories(plist["title"])
        download_playlist(plist["id"], plist["title"], categories[plist["title"]])

    download_videos(funhaus)

    with open("public/videos.json", "w") as f:
        json.dump(i_am_a_database_trust_me_bro, f, indent=4)


if __name__ == '__main__':
    run_all()
