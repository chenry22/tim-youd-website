import requests
import os

# essentially, running this will get up to 20 newly uploaded interviews to update
# and post them to the google sheet, which will be read by the live site

GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxx-NZ96PYfr-f9bCb-gAu4QFJQ8TL2krCMI2BoNp_egQnY-v_WWkfUS3_iZKuajvS4/exec"

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

def get_access_token(client_id, client_secret):
    response = requests.post(
        "https://accounts.spotify.com/api/token", 
        headers = { "Content-Type": "application/x-www-form-urlencoded" }, 
        data = { "grant_type": "client_credentials" }, 
        auth = (client_id, client_secret)
    )
    return response.json()["access_token"]


def get_episodes(token, last_id):
    headers = { "Authorization": f"Bearer {token}" }
    response = requests.get(
        "https://api.spotify.com/v1/shows/5WIyzbLxUQnEXNwcZMsmHp/episodes?limit=20", 
        headers = headers
    )
    data = response.json()
    while data['items'][-1] is None:
        response = requests.get(data['next'], headers = headers)
        data = response.json()

    episodes = []
    for item in data['items']:
        if not item is None:
            if item['id'] != last_id:
                break
            else:
                episodes.append(item)
    return episodes

def main():
    print("STARTING MAIN")
    response = requests.get(GOOGLE_SHEET_ENDPOINT, params = {"get": "last_episode_id"})
    print("GETTING CACHED ID")
    print("Status:", response.status_code)
    print("Response:", response.text)
    stored_id = response.text.strip()

    token = get_access_token(CLIENT_ID, CLIENT_SECRET)
    print("Got spotify access token!")
    new_episodes = get_episodes(token, stored_id)
    print("Got new episodes list!")

    if len(new_episodes) > 0:
        for episode in reversed(new_episodes):
            if ':' in episode['name']:
                data = { 'episode_id' : episode['id'], 'title' : episode['name'] }
                print(data)
                response = requests.post(
                    GOOGLE_SHEET_ENDPOINT, 
                    json = data
                )
                print("Status:", response.status_code)
                print("Response:", response.text)

if __name__ == "__main__":
    main()
