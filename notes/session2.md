_Overview: We introduce Gaussian elimination as the general method for solving systems of linear equations, applying it to assign weights and construct indices from real data. We then take up the broader question of whether a system is solvable at all, through rank and linear independence._


## Setting Up a System of Equations

Let us check in on our scholar of the USSR. Suppose, after becoming familiar with vector addition and scalar multiplication throughout Session 1, he has decided to build an index of his own to represent "Western alignment." In particular, he is looking to combining GDP growth and EU integration into one convenient number that he can use later on in his analysis of democratization. Recall that we have already explored this idea. Previously, we built one index where we weighted growth twice as heavily as integration (Example 1.6), and another one where we weighted the two variables equally (Example 1.7).

This time, though, the scholar is not content with simply picking those weights arbitrarily. Who is to say that growth should count twice as heavily as integration? Or that they should be equally important, for that matter? Instead of randomly choosing those weights, the scholar decides that they ought to be determined *by the data themselves*. Indeed, this seems like a very reasonable idea. Why should we take shots in the dark when we already have a collection of values that we trust in the form of our dataset?

The most "trustworthy" values here are the democracy scores that this scholar has already collected. Estonia, by any reasonable judgment, is the most Western-aligned and democratic of the six countries. Its recorded democracy score of 8 is _data_, not a guess, and can serve as a target the index should reproduce exactly. Latvia is also a well-established Baltic democracy with over two decades of consistent EU membership, so its recorded growth, integration, and democracy scores can serve as another anchor. If some combination of growth and EU integration weights reproduces both of these *observed* scores exactly, the data themselves have determined the weights. Nothing was assumed beyond what has been sitting in the table all along.

This is a specific instance of a much more general kind of problem: given known inputs and known outputs, find the unknown weights connecting them, driven entirely by observations already in hand.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">System of Linear Equations</span></span>
A collection of equations, each linear in the same set of unknowns. Written in matrix form, $A\mathbf{x} = \mathbf{b}$, where $A$ is a known matrix of coefficients, $\mathbf{b}$ is a known vector, and $\mathbf{x}$ is the unknown vector we are solving for.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Let us take the two examples we listed above: Estonia and Latvia. Estonia's GDP growth score is $7$, its integration score is $9$, and its democracy score is $8$. So our unknown weights ($w_1, w_2$) should satisfy the following equation:
$$
7w_1 + 9w_2 = 8
$$

In the case of Latvia, we apply the exact same logic. Latvia's GDP growth score of $6$, integration score of $8$, and democracy score of $7$, yields a second equation for us:
$$
6w_1 + 8w_2 = 7
$$

Two equations, two unknowns. The only "setup" remaining is to put it in matrix form, as follows:

$$
\begin{bmatrix} 7 & 9 \\ 6 & 8 \end{bmatrix}\begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} 8 \\ 7 \end{bmatrix}

$$

This is $A\mathbf{x}=\mathbf{b}$: every entry of $A$ and $\mathbf{b}$ is a number already sitting in the scholar's table. Nothing here was chosen by hand. Only $\mathbf{x}=(w_1,w_2)$ is unknown, and finding it means letting these two observed rows determine the weights, rather than assuming them.
</div>

This is exactly the shape of problem the scholar's full model eventually needs solved, just at the smallest possible scale: two known cases pinning down two unknown weights. Session 1 built the tools to write $A\mathbf{x}=\mathbf{b}$ compactly. In this session, we will build the tools to actually solve it systematically for a system of any size, not just $2\times2$.


## Gaussian Elimination

There is no shortage of ways to solve a $2\times2$ system like the one above by hand: substitution, elimination by inspection, guessing and checking. None of those approaches scales cleanly once a system has five, ten, or a hundred unknowns, which is the realistic size of a political scientist's design matrix. Gaussian elimination is the method that enables scale; it is a fixed, mechanical procedure that works identically regardless of size.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Elementary Row Operations</span></span>
Three operations can be applied to a system of equations (equivalently, to the rows of $A$ and $\mathbf{b}$ together) without changing the solution:
<ol>
<li>Swap two rows.</li>
<li>Multiply a row by a nonzero constant.</li>
<li>Add a multiple of one row to another row.</li>
</ol>
</div>

Why do these preserve the solution? Each operation just rewrites one or more equations as a combination of equations already known to be true: swapping the order two facts are listed in, scaling both sides of one true equation, or adding one true equation to another. None of that changes which values of $\mathbf{x}$ make every equation hold simultaneously.

The strategy is to use these operations to eliminate variables one at a time, working toward a form where the last equation involves only one unknown, the second-to-last involves at most two, and so on, at which point the system can be solved by simple back-substitution.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Row Echelon Form</span></span>
A matrix is in row echelon form when every row's leading nonzero entry (its <em>pivot</em>) sits strictly to the right of the pivot in the row above it, and any all-zero rows sit at the bottom.
</div>


The shape doesn't depend on the matrix being square, or on any particular size: only on where the pivots (marked $\color{red}\bullet$) fall relative to each other:
$$
\begin{bmatrix} \color{red}\bullet & * \\ 0 & \color{red}\bullet \end{bmatrix}, \qquad
\begin{bmatrix} \color{red}\bullet & * & * \\ 0 & \color{red}\bullet & * \\ 0 & 0 & \color{red}\bullet \end{bmatrix}, \qquad
\begin{bmatrix} \color{red}\bullet & * & * & * \\ 0 & \color{red}\bullet & * & * \\ 0 & 0 & 0 & \color{red}\bullet \end{bmatrix}, \qquad
\begin{bmatrix} \color{red}\bullet & * & * \\ 0 & \color{red}\bullet & * \\ 0 & 0 & 0 \end{bmatrix}
$$
Here $*$ stands for any number at all, including zero: only the pivots and the zeros below them are constrained. The third matrix shows a pivot allowed to skip a column (the third row's pivot sits in the fourth column, not the third), and the fourth shows what an all-zero row looks like once it appears: it's pushed to the bottom, below every row that still has a pivot.


<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is precisely the shape the elimination strategy above is aiming to produce. Once a system's augmented matrix looks like the examples above (a staircase of pivots, each one column further right than the last), back-substitution can proceed exactly as described: solve the bottom row (it has only one unknown left), then substitute upward, one row at a time.
</div>


By contrast, none of the following matrices is in row echelon form:
$$
\begin{bmatrix} 0 & \color{red}\bullet \\ \color{red}\bullet & * \end{bmatrix}, \qquad
\begin{bmatrix} \color{red}\bullet & * & * \\ 0 & 0 & \color{red}\bullet \\ 0 & \color{red}\bullet & * \end{bmatrix}, \qquad
\begin{bmatrix} \color{red}\bullet & * & * \\ 0 & 0 & 0 \\ 0 & \color{red}\bullet & * \end{bmatrix}
$$
In the first matrix, row 1's pivot is missing entirely (its leading entry is $0$): pivots have to appear top to bottom, not just in any order. In the second and third matrices, a pivot in a lower row sits in the <em>same or an earlier</em> column than the pivot above it, and in the third, a zero row sits above a nonzero one. Each of these is exactly the failure Gaussian elimination is designed to avoid.

<div class="callout example">
<span class="label"><span class="callout-type">Example: Gaussian Elimination Warm-Up</span></span>
Before returning to the scholar's data, a quick warm-up with some simpler numbers. We will now write the coefficients and the right-hand side together as an augmented matrix, which is simply a bookkeeping device that carries both through the same row operations at once.
$$
\begin{aligned}
x + y &= 5 \\
2x + y &= 8
\end{aligned}
\qquad\Longleftrightarrow\qquad
\left[\begin{array}{cc|c} 1 & 1 & 5 \\ 2 & 1 & 8 \end{array}\right] \begin{matrix} R_1 \\ R_2 \end{matrix}
$$

To eliminate $x$ from $R_2$, we replace $R_2$ with $R_2 - 2R_1$:
$$
 R_2 - 2R_1 \rightarrow R_2: \qquad
\left[\begin{array}{cc|c} 1 & 1 & 5 \\ 0 & -1 & -2 \end{array}\right]
$$
$R_2$ now involves only $y$: $-y = -2 \Rightarrow y = 2$.

Back-substitute. Plug $y=2$ into $R_1$: $x + 2 = 5 \Rightarrow x = 3$.

So $(x,y) = (3,2)$. We can check this solution by plugging the numbers back into the original equations: $3+2=5$, $2(3)+2=8$.
</div>

With the mechanics settled on "easy" numbers, the same process now applies directly to the scholar's actual data.


<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Return to our scholar's calibration system,
$$
\begin{bmatrix} 7 & 9 \\ 6 & 8 \end{bmatrix}\begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} 8 \\ 7 \end{bmatrix}
$$
As before, we write the coefficients and the right-hand side as an augmented matrix:
$$
\left[\begin{array}{cc|c} 7 & 9 & 8 \\ 6 & 8 & 7 \end{array}\right] \begin{matrix} R_1 \\ R_2 \end{matrix}
$$
Using row operation 3, add a multiple of $R_1$ to $R_2$ chosen so that $R_2$'s leading entry becomes zero. So, we replace $R_2$ with $R_2 - \tfrac{6}{7}R_1$:
$$
R_2 - \tfrac{6}{7}R_1 \rightarrow R_2: \qquad
\left[\begin{array}{cc|c} 7 & 9 & 8 \\ 0 & \tfrac{2}{7} & \tfrac{1}{7} \end{array}\right]
$$

Solve the bottom row. $R_2$ now says $\tfrac{2}{7}w_2 = \tfrac{1}{7}$, directly, i.e. $w_2 = \tfrac12$.

Back-substitute. Plug $w_2 = \tfrac12$ into $R_1$: $7w_1 + 9\left(\tfrac12\right) = 8 \Rightarrow 7w_1 = 8 - \tfrac92 = \tfrac72 \Rightarrow w_1 = \tfrac12$.

So $\mathbf{w} = \left(\tfrac12, \tfrac12\right)$. The index simply averages GDP growth and EU integration.
</div>


This procedure generalizes without modification to any size system: eliminate the first variable from every row below the first, then the second variable from every row below the second, and so on, until the matrix is in row echelon form. Back-substitution then unwinds the unknowns from the bottom up, exactly as in the example above.

To make sure we have the procedure down for larger systems, it's worthwhile to do another practice problem with "easy" numbers. You'll notice that the process is exactly the same, just with another dimension.

<div class="callout example">
<span class="label"><span class="callout-type">Example: Gaussian Elimination on a 3x3 System</span></span>

Consider the system:
$$
\begin{aligned}
x + y + z &= 6 \\
2x + y + 3z &= 13 \\
x - y + z &= 2
\end{aligned}
\qquad\Longleftrightarrow\qquad
\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 2 & 1 & 3 & 13 \\ 1 & -1 & 1 & 2 \end{array}\right] \begin{matrix} R_1 \\ R_2 \\ R_3 \end{matrix}
$$

Eliminate $x$ from $R_2$ by replacing $R_2$ with $R_2 - 2R_1$:
$$
R_2 - 2R_1 \rightarrow R_2: \qquad
\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -1 & 1 & 1 \\ 1 & -1 & 1 & 2 \end{array}\right]
$$

Eliminate $x$ from $R_3$ by replacing $R_3$ with $R_3 - R_1$:
$$
R_3 - R_1 \rightarrow R_3: \qquad
\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -1 & 1 & 1 \\ 0 & -2 & 0 & -4 \end{array}\right]
$$
$x$ is now gone from every row except $R_1$ (notice that the first column looks exactly the way the identity matrix's first column would, below the pivot).

Eliminate $y$ from $R_3$ by replacing $R_3$ with $R_3 - 2R_2$:
$$
R_3 - 2R_2 \rightarrow R_3: \qquad
\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -1 & 1 & 1 \\ 0 & 0 & -2 & -6 \end{array}\right]
$$
The matrix is now in row echelon form: each row's pivot sits strictly right of the one above it, and $R_3$ involves only $z$.

Solve from the bottom up. $R_3$: $-2z = -6 \Rightarrow z = 3$. Substitute into $R_2$: $-y + 3 = 1 \Rightarrow y = 2$. Substitute both into $R_1$: $x + 2 + 3 = 6 \Rightarrow x = 1$.

So $(x,y,z) = (1,2,3)$. Notice the pattern from the $2\times2$ case scaled up exactly as promised: one elimination pass per column, then back-substitution unwinds the answer one row at a time, bottom to top.
</div>



## When Elimination Goes "Wrong"

All of the examples we have done so far have worked out neatly: elimination produced a pivot in every row and back-substitution gave a unique answer. Unfortunately, this won't always happen. Precisely _what goes wrong_ turns out to be exactly the information a political scientist needs about their data.

Suppose our scholar's data source reports EU integration twice: once on the familiar $0$–$10$ scale already in his dataset, and again as a percentage out of $100$: the same underlying score, just rescaled. If he isn't paying attention, he might include both versions as separate predictors in his model, alongside GDP growth.


<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Let us take the data of the three Baltic countries—Estonia, Latvia, and Lithuania—and attempt to build an index using GDP growth, the $0$–$10$ integration score, and the $0$–$100$ integration score as three separate predictors:
$$
\left[\begin{array}{ccc|c}
7 & 9 & 90 & 8 \\
6 & 8 & 80 & 7 \\
7 & 8 & 80 & 8
\end{array}\right] \begin{matrix} R_1 \\ R_2 \\ R_3 \end{matrix}
$$
Eliminate $w_1$ from $R_2$ and $R_3$ using $R_1$:
$$
R_2 - \tfrac67 R_1 \rightarrow R_2, \qquad R_3 - R_1 \rightarrow R_3
$$
$$
\left[\begin{array}{ccc|c}
7 & 9 & 90 & 8 \\
0 & \tfrac27 & \tfrac{20}{7} & \tfrac17 \\
0 & -1 & -10 & 0
\end{array}\right]
$$
Now eliminate $w_2$ from $R_3$ using $R_2$: $R_3 + \tfrac72 R_2 \rightarrow R_3$:
$$
\left[\begin{array}{ccc|c}
7 & 9 & 90 & 8 \\
0 & \tfrac27 & \tfrac{20}{7} & \tfrac17 \\
0 & 0 & 0 & \tfrac12
\end{array}\right]
$$
Row 3 reduces to $0w_1 + 0w_2 + 0w_3 = \tfrac12$. This is a false statement, satisfied by no choice of weights whatsoever.
</div>

You may wonder if this is a coincidence of these particular democracy scores, or perhaps some other unfortunate artifact of these specific data. It is absolutely not! There is a more systematic problem here: the third column is exactly 10 multiplied by the second column, for every row, by construction. The $0$–$100$ integration score carries no information the $0$–$10$ score didn't already contain. Whenever one predictor is an exact rescaling of another already in the model, the coefficient matrix loses a dimension: no matter which countries are chosen or what their outcome scores happen to be, that column dependency is baked into the data itself, before any democracy scores ever enter the picture.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Linear Independence</span></span>
A set of vectors is linearly independent if none of them can be written as a combination (a weighted sum) of the others. Equivalently, the only way to combine them into the zero vector is to weight every one of them by zero.
</div>

The two integration columns are linearly <em>dependent</em>: $(\text{integration}_{100}) = 10\cdot(\text{integration}_{10})$, with nothing else needed. This is a surprisingly common, easy-to-miss trap in practice: unit conversions, the same variable reported at two different resolutions, or a total column sitting alongside its own components will all produce exactly this symptom! So be careful!
<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Rank</span></span>
The rank of a matrix is the number of pivots produced by Gaussian elimination: equivalently, the number of linearly independent rows (or, it turns out, equivalently the number of linearly independent columns). A matrix has <em>full rank</em> when its rank equals its number of rows (or columns, whichever is smaller).
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Check directly: the coefficient matrix in Example 2.5 has rank $2$, not $3$, regardless of which three countries were chosen or what their democracy scores happened to be because its columns can only ever span a $2$-dimensional space, no matter how many rows are stacked on top of it.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Rank is always found the same way: perform Gaussian elimination, and then count the pivots. Take
$$
\begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 7 \\ 1 & 1 & 1 \end{bmatrix}
$$
Eliminate the first column below $R_1$: $R_2 - 2R_1 \rightarrow R_2$, and then $R_3 - R_1 \rightarrow R_3$:
$$
\begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 1 \\ 0 & -1 & -2 \end{bmatrix}
$$
$R_2$'s pivot would normally sit in column 2, but that entry is $0$, so we swap $R_2$ and $R_3$ to bring a nonzero entry into position:
$$
\begin{bmatrix} 1 & 2 & 3 \\ 0 & -1 & -2 \\ 0 & 0 & 1 \end{bmatrix}
$$
Three pivots (columns 1, 2, 3), one per row: this matrix has rank $3$, full rank for a $3\times3$ matrix.
</div>



## Rank and Solvability

Elimination, as we have seen, helps us solve for unknowns. It also helps us determine whether a given system can be solved at all, and whether the solution (if one exists) is unique.



<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Consistent and Inconsistent Systems</span></span>
A system $A\mathbf{x}=\mathbf{b}$ is <em>consistent</em> if at least one solution exists, and <em>inconsistent</em> if none does.
</div>

Putting rank and consistency together, for a system $A\mathbf{x}=\mathbf{b}$ with $A$ square ($n\times n$):
<ul>
<li>If $A$ has full rank $n$, the system has exactly <em>one</em> solution, regardless of $\mathbf{b}$.</li>
<li>If $A$ is rank-deficient, the system either has <em>infinitely many</em> solutions (if the redundant rows all reduce to $0=0$) or <em>none</em> (if any redundant row reduces to $0=c$ for $c\neq0$), depending entirely on $\mathbf{b}$.</li>
</ul>

## The Inverse, via Elimination

Solving $A\mathbf{x}=\mathbf{b}$ by elimination works, but it's tied to one specific $\mathbf{b}$ (in the case of our running example, our vector of democracy scores). If the scholar later collects a new set of composite scores and wants the weights again, the whole elimination process would need to be redone from scratch. It would be far more useful to have a single object that solves the system for any $\mathbf{b}$, instantly.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Matrix Inverse</span></span>
For a square matrix $A$, its inverse $A^{-1}$ (if it exists) is the matrix satisfying
$$
A^{-1}A = I \qquad \text{and} \qquad AA^{-1} = I
$$
</div>

If $A^{-1}$ exists, solving $A\mathbf{x}=\mathbf{b}$ is immediate: multiply both sides on the left by $A^{-1}$.
$$
A^{-1}A\mathbf{x} = A^{-1}\mathbf{b} \quad\Longrightarrow\quad I\mathbf{x} = A^{-1}\mathbf{b} \quad\Longrightarrow\quad \mathbf{x} = A^{-1}\mathbf{b}
$$
This is the exact matrix analogue of solving $ax=b$ for a single number by multiplying both sides by $a^{-1}$. The identity matrix $I$ plays the role that the number $1$ plays in ordinary algebra, just as we talked about in Session 1.

As it turns out, finding $A^{-1}$ does not require any new machinery: it's the same elimination procedure from this session, run on a specifically chosen augmented matrix.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Gauss-Jordan Elimination</span></span>
To find $A^{-1}$ for an $n\times n$ matrix $A$: form the augmented matrix $[A \mid I]$, then apply row operations until the left block becomes $I$. Whatever ends up in the right block is $A^{-1}$.
</div>
<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Take $A = \begin{bmatrix} 1 & 1 \\ 2 & 1 \end{bmatrix}$ from before. Augment with $I$:
$$
\left[\begin{array}{cc|cc} 1 & 1 & 1 & 0 \\ 2 & 1 & 0 & 1 \end{array}\right] \begin{matrix} R_1 \\ R_2 \end{matrix}
$$ 
Eliminate below the first pivot, by replacing $R_2$ with $R_2 - 2R_1$:
$$
R_2 - 2R_1 \rightarrow R_2: \qquad
\left[\begin{array}{cc|cc} 1 & 1 & 1 & 0 \\ 0 & -1 & -2 & 1 \end{array}\right]
$$
Clear above the second pivot too (this is the "Jordan" half: eliminating upward as well as downward). Replace $R_1$ with $R_1 + R_2$:
$$
R_1 + R_2 \rightarrow R_1: \qquad
\left[\begin{array}{cc|cc} 1 & 0 & -1 & 1 \\ 0 & -1 & -2 & 1 \end{array}\right]
$$
Scale each row so the left block becomes $I$. Replace $R_2$ with $-R_2$:
$$
-R_2 \rightarrow R_2: \qquad
\left[\begin{array}{cc|cc} 1 & 0 & -1 & 1 \\ 0 & 1 & 2 & -1 \end{array}\right]
$$
So $A^{-1} = \begin{bmatrix} -1 & 1 \\ 2 & -1 \end{bmatrix}$.
</div>


Check this against the original elimination result. With $\mathbf{b} = (5,8)$:
$$
A^{-1}\mathbf{b} = \begin{bmatrix} -1 & 1 \\ 2 & -1 \end{bmatrix}\begin{bmatrix} 5 \\ 8 \end{bmatrix} = \begin{bmatrix} -5+8 \\ 10-8 \end{bmatrix} = \begin{bmatrix} 3 \\ 2 \end{bmatrix}
$$
Same answer as elimination gave directly, $(x,y)=(3,2)$, but now available instantly for <em>any</em> right-hand side, without having to repeat elimination from scratch.


Not every square matrix has an inverse. If $A$ is not full rank, Gauss-Jordan elimination will hit the same symptom seen earlier — a row on the left block reducing to all zeros — before the left side can ever become $I$. A matrix without an inverse is called <em>singular</em>; a matrix with one is <em>nonsingular</em> or <em>invertible</em>. This is the same rank condition from before, restated: $A^{-1}$ exists exactly when $A$ has full rank.

## The Determinant

Gauss-Jordan elimination tells you definitively whether $A$ is invertible, but only after you've done the work of performing the elimination. It would be useful to have a quick check, computable directly from $A$'s entries, that answers the yes/no question up front.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Determinant (2x2 Matrix)</span></span>
For $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, the determinant is
$$
\det(A) = ad - bc
$$
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
For $A = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$ from before, $\det(A) = (2)(1)-(1)(1) = 1$.
</div>

<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span></span>
A square matrix $A$ is invertible if and only if $\det(A) \neq 0$.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Recall the singular case from earlier, where the third row was an exact combination of the first two. Restrict to just the first two rows and columns of that scenario, $A=\begin{bmatrix} 2 & 1 \\ 4 & 2 \end{bmatrix}$. The second row is exactly twice the first, so no unique solution should exist. Check: $\det(A) = (2)(2)-(1)(4) = 4-4=0$. The determinant catches the singularity without having to perform any elimination at all.
</div>

Geometrically, $|\det(A)|$ measures how much $A$ stretches or shrinks area (in 2D) or volume (in higher dimensions) when it acts on vectors. A determinant of zero means $A$ collapses space into a lower dimension: squashing a 2D plane down onto a single line, for instance, which is, indeed, exactly why no inverse can exist: information about the second dimension has been destroyed, and there's no way to recover it.

The determinant formula grows more involved for larger matrices ($3\times3$ and up), and computing it directly becomes impractical by hand well before matrices reach the sizes political scientists actually work with. In practice, the determinant is rarely computed by the raw formula: it falls out of elimination almost "for free," as the product of the pivots (up to a sign that tracks row swaps). The formula above is worth knowing by hand for the $2\times2$ case specifically, since it's what makes the invertibility condition concrete for us.

## Closing the Loop

Return once more to our scholar's question: what weight vector best explains democracy score in terms of GDP growth and EU integration? Session 1 gave us a way to *write* that question precisely, as $A\mathbf{w}=\mathbf{b}$ for some matrix $A$ and vector $\mathbf{b}$ built from the data. This session gave a way to *answer* it: Gaussian elimination solves the system directly, and when $A$ is square and full rank, $\mathbf{w}=A^{-1}\mathbf{b}$ answers it for any $\mathbf{b}$ at all. The determinant gives us something that is equivalent to that full-rank condition, but compressed into a single number: $\det(A)\neq0$, a pivot surviving in every row under elimination, $A^{-1}$ existing, and $A\mathbf{w}=\mathbf{b}$ having exactly one solution are all just different descriptions of the same underlying fact. This is why checking $\det(A)$ first can tell you, before doing any of the work, whether the rest of this section's machinery will even succeed.