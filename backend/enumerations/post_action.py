from enum import Enum

class PostActions(Enum):
    LIKE = "like"
    DISLIKE = "dislike"

if __name__ == '__main__':
    print(PostActions("like"))