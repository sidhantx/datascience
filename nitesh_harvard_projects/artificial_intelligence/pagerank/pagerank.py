import os
import random
import re
import sys

DAMPING = 0.85
SAMPLES = 10000


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python pagerank.py corpus")
    corpus = crawl(sys.argv[1])
    ranks = sample_pagerank(corpus, DAMPING, SAMPLES)
    print(f"PageRank Results from Sampling (n = {SAMPLES})")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")
    ranks = iterate_pagerank(corpus, DAMPING)
    print(f"PageRank Results from Iteration")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")


def crawl(directory):
    """
    Parse a directory of HTML pages and check for links to other pages.
    Return a dictionary where each key is a page, and values are
    a list of all other pages in the corpus that are linked to by the page.
    """
    pages = dict()

    # Extract all links from HTML files
    for filename in os.listdir(directory):
        if not filename.endswith(".html"):
            continue
        with open(os.path.join(directory, filename)) as f:
            contents = f.read()
            links = re.findall(r"<a\s+(?:[^>]*?)href=\"([^\"]*)\"", contents)
            pages[filename] = set(links) - {filename}

    # Only include links to other pages in the corpus
    for filename in pages:
        pages[filename] = set(
            link for link in pages[filename]
            if link in pages
        )

    return pages


def transition_model(corpus, page, damping_factor):
    """
    Return a probability distribution over which page to visit next,
    given a current page.

    With probability `damping_factor`, choose a link at random
    linked to by `page`. With probability `1 - damping_factor`, choose
    a link at random chosen from all pages in the corpus.
    """
    # init a empty dictionary for distributions
    distributions = {k: 0 for k in corpus.keys()}

    num_links = len(corpus[page])

    if num_links == 0:
        for key in corpus:
            distributions[key] = 1 / len(corpus)
    else:
        link_probability = damping_factor / len(corpus[page])
        random_prob = (1 - damping_factor) / len(corpus)
        # set the distributions for links found in the page
        for v in corpus[page]:
            distributions[v] = link_probability + random_prob
        # set distribution for links not in the page
        for key in corpus:
            if key not in corpus[page]:
                distributions[key] = random_prob

    return distributions


def sample_pagerank(corpus, damping_factor, n):
    """
    Return PageRank values for each page by sampling `n` pages
    according to transition model, starting with a page at random.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """

    rank_dictionary = {}
    if len(corpus.keys()) != 0:
        corpus_pages = list(corpus.keys())

        # init a dictionary to store the count of each page in
        # the corpus selected randomly
        page_dict = {k: 0 for k in corpus_pages}

        # first sample
        page = random.choice(corpus_pages)
        page_dict[page] += 1
        distribution = transition_model(corpus, page, damping_factor)

        # run the loop n times to generate n samples of page each
        # with probability distribution
        for i in range(n - 1):
            weights = list(distribution.values())
            page = random.choices(corpus_pages, weights=weights, k=1)[0]
            distribution = transition_model(corpus, page, damping_factor)
            page_dict[page] += 1

        # calculate the probability of each page and assign it ot
        rank_dictionary = {key: page_dict[key] / n for key in page_dict.keys()}

    return rank_dictionary


def iterate_pagerank(corpus, damping_factor):
    """
    Return PageRank values for each page by iteratively updating
    PageRank values until convergence.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """
    N = len(corpus.keys())
    rank_dict = {}

    if N != 0:

        # initialize random_walk as the probability of going to
        # page using the formula provided
        random_walk = (1 - damping_factor) / N

        # stores the distribution of each page in the corpus
        rank_dict = {k: (1 / N) for k in corpus.keys()}

        # stores the next distribution of each page in the corpus
        rank_dict_next = {k: 0 for k in corpus.keys()}

        not_converged = True
        # loop through and calculate the  distribution of page in
        # the corpus. exit when converged.
        while (not_converged):

            for key in corpus.keys():
                pr = random_walk
                pr += damping_factor * get_probability(corpus, key, rank_dict)
                rank_dict_next[key] = pr

            if check_convergence(rank_dict, rank_dict_next):
                not_converged = False
            else:
                rank_dict = rank_dict_next.copy()

    return rank_dict


# Helper Methods
def get_probability(corpus, page, rank_dictionary):
    """
    Helper method that calculates the sum of probabilities for
    each page that has links to our given page.  For a page with
    no links, it is assumed that it has links to all the pages
    including itself.

        Parameters :
            corpus (dict) : Python dictionary mapping a page name
            to a set of all pages linked to it.

            page (str) : The page whose probabilities are being calculated

            rank_dictionary (dict) : Python dictionary mapping each page
            to its current probabilities
        Returns
            estimate (float) :  the sum of probability for our parameter
            page from all other pages in the corpus
    """
    estimate = 0
    # loop through each page in the corpus, calculate  Pr(i)/Numlinks(i)
    # if a page has no link, we assume it contains the links to all pages
    # in the corpus including itself
    for k, values in corpus.items():
        if len(values) == 0:
            estimate += rank_dictionary[k] / len(corpus.keys())
        else:
            if k != page and page in values:
                estimate += rank_dictionary[k] / len(values)
    return estimate


def check_convergence(prev_dict, next_dict):
    """
    Helper method to check convergence has happened for our iterations.

        Parameters:

            prev_dict(dict): dictionary mapping the probabilities of pages
             for our previous iteration
            next_dict(dict): dictionary mapping the probabilities of pages
            for our current iteration
        Returns:
            converged(bool) : True if converged False otherwise
    """

    flags = []
    converged = False
    # loop through and check if diff of page rank distribution
    # between previous and current iteration are <=0.001
    for key in prev_dict:
        diff = prev_dict[key] - next_dict[key]
        if diff <= 0.001:
            flags.append(1)
        else:
            flags.append(0)
    # check for convergence
    if sum(flags) == len(prev_dict.keys()):
        converged = True
    return converged


if __name__ == "__main__":
    main()
