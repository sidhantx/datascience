import itertools
import random


class Minesweeper():
    """
    Minesweeper game representation
    """

    def __init__(self, height=8, width=8, mines=8):

        # Set initial width, height, and number of mines
        self.height = height
        self.width = width
        self.mines = set()

        # Initialize an empty field with no mines
        self.board = []
        for i in range(self.height):
            row = []
            for j in range(self.width):
                row.append(False)
            self.board.append(row)

        # Add mines randomly
        while len(self.mines) != mines:
            i = random.randrange(height)
            j = random.randrange(width)
            if not self.board[i][j]:
                self.mines.add((i, j))
                self.board[i][j] = True

        # At first, player has found no mines
        self.mines_found = set()

    def print(self):
        """
        Prints a text-based representation
        of where mines are located.
        """
        for i in range(self.height):
            print("--" * self.width + "-")
            for j in range(self.width):
                if self.board[i][j]:
                    print("|X", end="")
                else:
                    print("| ", end="")
            print("|")
        print("--" * self.width + "-")

    def is_mine(self, cell):
        i, j = cell
        return self.board[i][j]

    def nearby_mines(self, cell):
        """
        Returns the number of mines that are
        within one row and column of a given cell,
        not including the cell itself.
        """

        # Keep count of nearby mines
        count = 0

        # Loop over all cells within one row and column
        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):

                # Ignore the cell itself
                if (i, j) == cell:
                    continue

                # Update count if cell in bounds and is mine
                if 0 <= i < self.height and 0 <= j < self.width:
                    if self.board[i][j]:
                        count += 1

        return count

    def won(self):
        """
        Checks if all mines have been flagged.
        """
        return self.mines_found == self.mines


class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    def known_mines(self):
        """
        Returns the set of all cells in self.cells known to be mines.
        """
        if len(self.cells) == self.count:
            return self.cells.copy()
        return set()

    def known_safes(self):
        """
        Returns the set of all cells in self.cells known to be safe.
        """
        if self.count == 0 and len(self.cells) > 0:
            return self.cells.copy()
        return set()

    def mark_mine(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be a mine.
        """
        if cell in self.cells:
            self.cells.remove(cell)
            self.count = self.count - 1

    def mark_safe(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be safe.
        """
        if cell in self.cells:
            self.cells.remove(cell)


class MinesweeperAI():
    """
    Minesweeper game player
    """

    def __init__(self, height=8, width=8):

        # Set initial height and width
        self.height = height
        self.width = width

        # Keep track of which cells have been clicked on
        self.moves_made = set()

        # Keep track of cells known to be safe or mines
        self.mines = set()
        self.safes = set()

        # List of sentences about the game known to be true
        self.knowledge = []

    def mark_mine(self, cell):
        """
        Marks a cell as a mine, and updates all knowledge
        to mark that cell as a mine as well.
        """
        self.mines.add(cell)
        for sentence in self.knowledge:
            sentence.mark_mine(cell)

    def mark_safe(self, cell):
        """
        Marks a cell as safe, and updates all knowledge
        to mark that cell as safe as well.
        """
        self.safes.add(cell)
        for sentence in self.knowledge:
            sentence.mark_safe(cell)

    def add_knowledge(self, cell, count):
        """
        Called when the Minesweeper board tells us, for a given
        safe cell, how many neighboring cells have mines in them.

        This function should:
            1) mark the cell as a move that has been made
            2) mark the cell as safe
            3) add a new sentence to the AI's knowledge base
               based on the value of `cell` and `count`
            4) mark any additional cells as safe or as mines
               if it can be concluded based on the AI's knowledge base
            5) add any new sentences to the AI's knowledge base
               if they can be inferred from existing knowledge
        """
        # 1. Add the cell to moves_made
        self.moves_made.add(cell)

        # 2. Add the cell to safes
        self.safes.add(cell)

        # 3. Create a sentence for the clicked cell with all the neighbor cells, and the count.
        sentence = self.create_sentence(cell, count)
        if len(sentence.cells) != 0:
            self.knowledge.append(sentence)

        # flag for the loop. The flag is set to True so that we can continue to make inferences
        # when there is any change in our ai knowledge
        inference_flag = True

        # 4 and 5 : Make inferences
        while inference_flag:
            # set to false. If any changes are made to our ai knowledge, it will be set to True and we will continue
            # to make inferences in the while loop
            inference_flag = False

            # check 1st inference i.e. cells are mines. If yes mark them so they are removed from
            # our sentences and added to mines
            for sent in self.knowledge:
                cells = sent.known_mines()
                if len(cells) > 0:
                    for cell in cells:
                        self.mark_mine(cell)
                        inference_flag = True

            # check 2nd inference i.e. all cells are safe. If yes mark them so, they are marked safe and
            # are removed from our knowledge and added to safes
            for sent in self.knowledge:
                if len(sent.cells) != 0:
                    safe_cells = sent.known_safes()
                    if len(safe_cells) > 0:
                        for cell in safe_cells:
                            self.mark_safe(cell)
                            inference_flag = True

            # check 3rd inference i.e. if a set is a subset of another set create additional knowledge for ai.

            # remove any empty set. This creates unnecessary permutations for checking subsets,
            # and needs to be pruned from the knowledge.
            for sent in self.knowledge.copy():
                if len(sent.cells) == 0:
                    self.knowledge.remove(sent)

            # loop through all the 2 permutations of sentence in the knowledge and check for a subset.
            # If a subset is found add to our new knowledge.
            # Once a new knowledge has been added break out of the loop to check if other inferences
            # can be made on the new knowledge
            if len(self.knowledge) >1:
                for perm in itertools.permutations(self.knowledge.copy(), 2):
                    if perm[0].cells.issubset(perm[1].cells):
                        new_sent = Sentence(perm[1].cells - perm[0].cells, perm[1].count - perm[0].count)
                        self.knowledge.append(new_sent)
                        self.knowledge.remove(perm[1])
                        inference_flag = True
                        #new sentence added. Break out and check if inference 1 and 2 applies
                        break

    def make_safe_move(self):
        """
        Returns a safe cell to choose on the Minesweeper board.
        The move must be known to be safe, and not already a move
        that has been made.

        This function may use the knowledge in self.mines, self.safes
        and self.moves_made, but should not modify any of those values.
        """
        safe_move = self.safes - self.moves_made
        if len(safe_move) == 0:
            return None
        else:
            return safe_move.pop()

    def make_random_move(self):
        """
        Returns a move to make on the Minesweeper board.
        Should choose randomly among cells that:
            1) have not already been chosen, and
            2) are not known to be mines
        """
        random_set = set()
        for i in range(self.height):
            for k in range(self.width):
                if (i, k) not in self.moves_made and (i, k) not in self.mines:
                    random_set.add((i, k))

        if len(random_set) > 0:
            return random_set.pop()
        return None

    def create_sentence(self, cell, count):
        """
        Returns a sentence with all the neighbors and its count for the input cell.
        """
        # store all the possible moves in this board
        possible_moves = set()
        for i in range(self.height):
            for j in range(self.width):
                possible_moves.add((i, j))

        # remove the current cell that was clicked
        possible_moves.remove(cell)

        # creates all the neighbors for the cell. Some moves may not be possible i.e. for the
        # corner cell. This is filtered out using the possible moves set created above
        right_neighbor = (cell[0], cell[1] + 1)
        left_neighbor = (cell[0], cell[1] - 1)
        up_neighbor = (cell[0] - 1, cell[1])
        down_neighbor = (cell[0] + 1, cell[1])
        diag_right_down = (cell[0] + 1, cell[1] + 1)
        diag_left_down = (cell[0] + 1, cell[1] - 1)
        diag_right_up = (cell[0] - 1, cell[1] + 1)
        diag_left_up = (cell[0] - 1, cell[1] - 1)

        cell_neighbors = set()

        # filter all the neighbor cells for the given cell
        if right_neighbor in possible_moves and right_neighbor not in self.safes:
            cell_neighbors.add(right_neighbor)

        if left_neighbor in possible_moves and left_neighbor not in self.safes:
            cell_neighbors.add(left_neighbor)

        if up_neighbor in possible_moves and up_neighbor not in self.safes:
            cell_neighbors.add(up_neighbor)

        if down_neighbor in possible_moves and down_neighbor not in self.safes:
            cell_neighbors.add(down_neighbor)

        if diag_right_down in possible_moves and diag_right_down not in self.safes:
            cell_neighbors.add(diag_right_down)

        if diag_left_down in possible_moves and diag_left_down not in self.safes:
            cell_neighbors.add(diag_left_down)

        if diag_right_up in possible_moves and diag_right_up not in self.safes:
            cell_neighbors.add(diag_right_up)

        if diag_left_up in possible_moves and diag_left_up not in self.safes:
            cell_neighbors.add(diag_left_up)

        if len(cell_neighbors) > 0:
            return Sentence(cell_neighbors, count)
        return Sentence(set(), count)
