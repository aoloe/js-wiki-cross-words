# Crosswords: search topic related words in Wikipedia

## Links only?

There was the idea to only list words that are links but:

- links often contain multiple words (in which case we should have two version of the entries: the full entry and one entry for each word)
- there are often very many useless words in the links
- the api only returns a max of 500 links per request (and it's a bit more complex to make multiple requests).

All in all, the advantages of getting the links only do not seem to justify the effort needed for implementing the feature.
