"""
Tic Tac Toe Player
"""

import math
import copy

X = "X"
O = "O"
EMPTY = None
ROW = 3
COLUMN = 3


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.
    """
    x_count = sum([a.count(X) for a in board])
    o_count = sum([a.count(O) for a in board])
    if o_count < x_count:
        return O
    return X


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    action_list = set()
    for row in range(len(board)):
        for col in range(len(board[0])):
            if board[row][col] is None:
                action_list.add((row, col))
    return action_list


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """
    new_board = copy.deepcopy(board)
    new_board[action[0]][action[1]] = player(board)
    return new_board


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """
    # check if there is a winner horizontally
    game_winner = check_row_winner(board)
    if game_winner is not None:
        return game_winner

    # check if there is a winner vertically
    game_winner = check_col_winner(board)
    if game_winner is not None:
        return game_winner

    # check if there is a winner diagonally
    game_winner = check_diagonal_winner(board)
    if game_winner is not None:
        return game_winner

    return game_winner


def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    if sum([a.count(None) for a in board]) == 0 or winner(board) is not None:
        return True
    else:
        return False


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    game_winner = winner(board)
    if game_winner == X:
        return 1
    elif game_winner == O:
        return -1
    else:
        return 0


def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    if terminal(board):
        return None

    my_list = []

    #Get the best move for the X player that gives the max number
    if player(board) == X:
        for action in actions(board):
            new_board = copy.deepcopy(board)
            new_board = result(new_board, action)
            v = min_value(new_board)
            my_list.append((v, action))

        index = 0
        max_val = my_list[0][0]
        for i in range(len(my_list)):
            if my_list[i][0] >= max_val:
                max_val = my_list[i][0]
                index = i
        return my_list[index][1]

    # Get the best move for the O player that gives the min number
    else:
        for action in actions(board):
            new_board = result(copy.deepcopy(board), action)
            v = max_value(new_board)
            my_list.append((v, action))

        index = 0
        min_val = my_list[0][0]
        for i in range(len(my_list)):
            if my_list[i][0] <= min_val:
                min_val = my_list[i][0]
                index = i
        return my_list[index][1]


def max_value(board):
    if terminal(board):
        # print("In max_value :")
        # print(board)
        return utility(board)

    v = (-1) * math.inf

    for action in actions(board):
        v = max(v, min_value(result(board, action)))
    return v


def min_value(board):
    if terminal(board):
        # print("In min_value :")
        # print(board)
        return utility(board)

    v = math.inf

    for action in actions(board):
        v = min(v, max_value(result(board, action)))
    return v


# helper functions
def check_winner_helper(x_count_list, o_count_list):
    TOTAL_TO_WIN = 3
    winner = None
    if TOTAL_TO_WIN in x_count_list:
        winner = X
    elif TOTAL_TO_WIN in o_count_list:
        winner = O
    return winner


def check_row_winner(board):
    TOTAL_TO_WIN = 3
    winner = None
    x_count_list = [a.count(X) for a in board]
    o_count_list = [a.count(O) for a in board]
    return check_winner_helper(x_count_list, o_count_list)


def check_col_winner(board):
    x_count_list = []
    o_count_list = []
    for i in range(3):
        x_count = 0
        o_count = 0
        for k in range(3):
            if board[k][i] == X:
                x_count += 1

            if board[k][i] == O:
                o_count += 1

            if k == 2:
                x_count_list.append(x_count)
                o_count_list.append(o_count)
    print(x_count_list, o_count_list)
    return check_winner_helper(x_count_list, o_count_list)


def check_diagonal_winner(board):
    x_count = 0
    o_count = 0
    winner = None

    for i in range(3):
        for k in range(3):
            if i == k:
                if board[i][k] == X:
                    x_count += 1

                if board[i][k] == O:
                    o_count += 1

    if x_count == 3:
        return X

    elif o_count == 3:
        return O

    l = [(0, 2), (1, 1), (2, 0)]
    x_count = 0
    o_count = 0
    for i in range(3):
        for k in range(3):
            if (i, k) in l:
                if board[i][k] == X:
                    x_count += 1

                if board[i][k] == O:
                    o_count += 1
    if x_count == 3:
        return X

    elif o_count == 3:
        return O

    return winner
