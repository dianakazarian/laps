_Overview: Insert here._

<!--
<a class="resource-link" href="slides/laps_session_1.pdf" target="_blank" rel="noopener">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  Session 2 Slides
</a>
-->

## Systems of Linear Equations

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">System of linear equations</span></span>
A system of linear equations is a collection of equations, each linear in the same set of unknowns. Written in matrix form, $A\mathbf{x} = \mathbf{b}$, where $A$ is a known matrix of coefficients, $\mathbf{b}$ is a known vector, and $\mathbf{x}$ is the unknown vector we're solving for.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Suppose two composite indices were built from growth and EU integration — one gave growth double weight, the other weighted them equally — and only the resulting composite scores for two countries were reported, not the weights used to build them. Recovering the weights means solving:
$$
\begin{aligned}
2w_1 + w_2 &= 8 \\
w_1 + w_2 &= 5
\end{aligned}
\qquad\Longleftrightarrow\qquad
\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} 8 \\ 5 \end{bmatrix}
$$

This is $A\mathbf{x} = \mathbf{b}$: $A$ is the matrix of known coefficients, $\mathbf{b}$ is the known outcome, and $\mathbf{x} = (w_1, w_2)$ is what we want to recover.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is exactly the shape of problem the scholar actually faces, just smaller: given some known relationship between inputs and an outcome, recover the unknown weights connecting them. Session 1 built the tools to *write down* $A\mathbf{x}=\mathbf{b}$ compactly. This session builds the tools to actually *solve* it — by hand, systematically, for a system of any size, not just $2\times2$.
</div>

## Gaussian Elimination

There's no shortage of ways to solve a $2\times2$ system like the one above by hand — substitution, elimination by inspection, guessing and checking. None of those approaches scale cleanly once a system has five, ten, or a hundred unknowns, which is the realistic size of a political scientist's design matrix. Gaussian elimination is the method that does scale: a fixed, mechanical procedure that works identically regardless of size.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Elementary row operations</span></span>
Three operations can be applied to a system of equations (equivalently, to the rows of $A$ and $\mathbf{b}$ together) without changing the solution:
<ol>
<li>Swap two rows.</li>
<li>Multiply a row by a nonzero constant.</li>
<li>Add a multiple of one row to another row.</li>
</ol>
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Why do these preserve the solution? Each operation just rewrites one or more equations as a combination of equations already known to be true — swapping the order two facts are listed in, scaling both sides of one true equation, or adding one true equation to another. None of that changes which values of $\mathbf{x}$ make every equation hold simultaneously.
</div>

The strategy is to use these operations to eliminate variables one at a time, working toward a form where the last equation involves only one unknown, the second-to-last involves at most two, and so on — at which point the system can be solved by simple back-substitution.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Return to
$$
\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} 8 \\ 5 \end{bmatrix}
$$
Write the coefficients and the right-hand side together as an augmented matrix, a bookkeeping device that carries both through the same row operations at once:
$$
\left[\begin{array}{cc|c} 2 & 1 & 8 \\ 1 & 1 & 5 \end{array}\right]
$$
**Step 1: eliminate $w_1$ from row 2.** Subtract $\tfrac{1}{2}$ of row 1 from row 2:
$$
\left[\begin{array}{cc|c} 2 & 1 & 8 \\ 0 & \tfrac{1}{2} & 1 \end{array}\right]
$$
Row 2 now says $\tfrac{1}{2}w_2 = 1$, i.e. $w_2 = 2$ — a single equation in a single unknown.

**Step 2: back-substitute.** Plug $w_2 = 2$ into row 1: $2w_1 + 2 = 8 \Rightarrow w_1 = 3$.

So $\mathbf{w} = (3, 2)$: the first composite index weighted growth 3 and integration 2 — wait, this is what we're *solving for*, not what we assumed; check it against the original system: $2(3)+2 = 8$ ✓, $3+2=5$ ✓.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Row echelon form</span></span>
A matrix is in row echelon form when every row's leading nonzero entry (its <em>pivot</em>) sits strictly to the right of the pivot in the row above it, and any all-zero rows sit at the bottom. The elimination step above transformed $A$ into exactly this form — an upper-triangular shape with a pivot in every row.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This procedure generalizes without modification to any size system: eliminate the first variable from every row below the first, then the second variable from every row below the second, and so on, until the matrix is in row echelon form. Back-substitution then unwinds the unknowns from the bottom up, exactly as in Step 2 above.
</div>

## When elimination doesn't go cleanly

The example above worked out neatly: two equations, two unknowns, elimination produced a pivot in every row, and back-substitution gave a unique answer. This won't always happen — and what goes wrong, and how it shows up during elimination, turns out to be exactly the information a political scientist needs about their data.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Suppose a third "index" had been reported, built by weighting growth and integration in a way that just happened to be the *sum* of the first two indices already in the system:
$$
\left[\begin{array}{cc|c} 2 & 1 & 8 \\ 1 & 1 & 5 \\ 3 & 2 & 13 \end{array}\right]
$$
Eliminate $w_1$ from rows 2 and 3 using row 1 (subtract $\tfrac12$ row 1 from row 2, subtract $\tfrac32$ row 1 from row 3):
$$
\left[\begin{array}{cc|c} 2 & 1 & 8 \\ 0 & \tfrac12 & 1 \\ 0 & \tfrac12 & 1 \end{array}\right]
$$
Now subtract row 2 from row 3:
$$
\left[\begin{array}{cc|c} 2 & 1 & 8 \\ 0 & \tfrac12 & 1 \\ 0 & 0 & 0 \end{array}\right]
$$
Row 3 has vanished entirely — it reduced to $0=0$, a statement that's always true and tells us nothing new about $w_1, w_2$.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This isn't a computational accident. Row 3 of the original system, $3w_1 + 2w_2 = 13$, was exactly row 1 plus row 2 all along — it carried no information beyond what rows 1 and 2 already contained. Elimination didn't just fail to find a third pivot; it *discovered* that the third equation was redundant, by mechanically reducing it to nothing.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Linear independence</span></span>
A set of vectors is linearly independent if none of them can be written as a combination (a weighted sum) of the others. Equivalently, the only way to combine them into the zero vector is to weight every one of them by zero.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
The three rows above were linearly <em>dependent</em>: row 3 was $1\times$row 1 $+\ 1\times$row 2. This is precisely the political-science scenario to watch for — if one variable in a dataset is an exact (or near-exact) combination of others already included, it carries no new information, and any system built from it will show the same symptom under elimination: a row that reduces to zero.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Rank</span></span>
The rank of a matrix is the number of pivots produced by Gaussian elimination — equivalently, the number of linearly independent rows (or, it turns out, equivalently the number of linearly independent columns). A matrix has <em>full rank</em> when its rank equals its number of rows (or columns, whichever is smaller).
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
The $2\times2$ system from before had rank 2 — full rank, two pivots, a unique solution. The $3\times2$ system just worked had rank 2 as well, despite having three rows: only two pivots appeared, because the third row was redundant. Rank measures how much genuinely independent information a system actually contains, which is not always the same as how many equations (or variables) it appears to have.
</div>

## What rank tells you about solvability

Elimination doesn't just reveal *how much* independent information a system carries — it tells you, directly, whether the system can be solved at all, and whether the solution (if one exists) is unique.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Modify the redundant-row system slightly: suppose the third reported composite score was $14$ instead of $13$, even though the weights $(3,2)$ were still supposed to be row 1 plus row 2:
$$
\left[\begin{array}{cc|c} 2 & 1 & 8 \\ 1 & 1 & 5 \\ 3 & 2 & 14 \end{array}\right]
$$
Eliminating exactly as before (subtract $\tfrac12$ row 1 from row 2, $\tfrac32$ row 1 from row 3, then row 2 from row 3):
$$
\left[\begin{array}{cc|c} 2 & 1 & 8 \\ 0 & \tfrac12 & 1 \\ 0 & 0 & 1 \end{array}\right]
$$
Row 3 now reads $0w_1 + 0w_2 = 1$ — a false statement, true for no values of $w_1, w_2$ whatsoever. There is no vector $\mathbf{w}$ that satisfies all three equations simultaneously.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Consistent and inconsistent systems</span></span>
A system $A\mathbf{x}=\mathbf{b}$ is <em>consistent</em> if at least one solution exists, and <em>inconsistent</em> if none does. Under elimination, inconsistency shows up as a row reducing to $0 = c$ for some nonzero constant $c$ — exactly the situation above.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Compare the two versions of this example carefully, because the distinction matters. When the third row reduced to $0=0$ (the earlier example), the equation was redundant but not contradictory — dropping it left a perfectly solvable system, just with fewer independent constraints than equations. When it instead reduces to $0=c$ for $c\neq0$, the equations actively conflict, and no solution exists at all. Elimination distinguishes these two cases automatically, just by what constant ends up on the right-hand side of the vanished row.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Putting the pieces together, for a system $A\mathbf{x}=\mathbf{b}$ with $A$ square ($n\times n$):
<ul>
<li>If $A$ has full rank $n$ (a pivot in every row and column), the system has exactly <em>one</em> solution, regardless of $\mathbf{b}$.</li>
<li>If $A$ does not have full rank, the system either has <em>infinitely many</em> solutions (redundant but consistent rows — like the $0=0$ case) or <em>no</em> solution (an inconsistent row — like the $0=c$ case just above), depending on $\mathbf{b}$.</li>
</ul>
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is the precise version of a question every applied researcher eventually runs into under a vaguer name: what happens if two of my predictors are (nearly) redundant? A rank-deficient $A$ is the exact mechanism. The scholar's design matrix losing full rank — say, if EU integration turned out to be an exact linear function of growth across every country in the sample — would mean the system determining the model's weights no longer has a unique solution, for reasons now visible directly in the elimination process rather than as a mysterious warning from statistical software.
</div>

## The inverse, via elimination

Solving $A\mathbf{x}=\mathbf{b}$ by elimination works, but it's tied to one specific $\mathbf{b}$ — if the scholar later collects a new set of composite scores and wants the weights again, the whole elimination process would need to be redone from scratch. It would be far more useful to have a single object that solves the system for *any* $\mathbf{b}$, instantly.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Matrix inverse</span></span>
For a square matrix $A$, its inverse $A^{-1}$ (if it exists) is the matrix satisfying
$$
A^{-1}A = I \qquad \text{and} \qquad AA^{-1} = I
$$
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
If $A^{-1}$ exists, solving $A\mathbf{x}=\mathbf{b}$ is immediate: multiply both sides on the left by $A^{-1}$.
$$
A^{-1}A\mathbf{x} = A^{-1}\mathbf{b} \quad\Longrightarrow\quad I\mathbf{x} = A^{-1}\mathbf{b} \quad\Longrightarrow\quad \mathbf{x} = A^{-1}\mathbf{b}
$$
This is the exact matrix analogue of solving $ax=b$ for a single number by multiplying both sides by $a^{-1}$ — the identity matrix $I$ plays the role that the number $1$ plays in ordinary algebra, precisely as flagged back in session 1.
</div>

Finding $A^{-1}$ turns out not to require new machinery — it's the same elimination procedure from this session, run on a cleverly chosen augmented matrix.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Gauss-Jordan elimination</span></span>
To find $A^{-1}$ for an $n\times n$ matrix $A$: form the augmented matrix $[A \mid I]$, then apply row operations until the left block becomes $I$. Whatever ends up in the right block is $A^{-1}$.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Take $A = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$ from before. Augment with $I$:
$$
\left[\begin{array}{cc|cc} 2 & 1 & 1 & 0 \\ 1 & 1 & 0 & 1 \end{array}\right]
$$
**Eliminate below the first pivot:** subtract $\tfrac12$ row 1 from row 2:
$$
\left[\begin{array}{cc|cc} 2 & 1 & 1 & 0 \\ 0 & \tfrac12 & -\tfrac12 & 1 \end{array}\right]
$$
**Clear above the second pivot too** (this is the "Jordan" half — eliminating upward as well as downward): subtract $2\times$ row 2 from row 1:
$$
\left[\begin{array}{cc|cc} 2 & 0 & 2 & -2 \\ 0 & \tfrac12 & -\tfrac12 & 1 \end{array}\right]
$$
**Scale each row so the left block becomes $I$:** divide row 1 by 2, row 2 by $\tfrac12$:
$$
\left[\begin{array}{cc|cc} 1 & 0 & 1 & -1 \\ 0 & 1 & -1 & 2 \end{array}\right]
$$
So $A^{-1} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Check this against the earlier result. With $\mathbf{b} = (8,5)$:
$$
A^{-1}\mathbf{b} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}\begin{bmatrix} 8 \\ 5 \end{bmatrix} = \begin{bmatrix} 8-5 \\ -8+10 \end{bmatrix} = \begin{bmatrix} 3 \\ 2 \end{bmatrix}
$$
Same answer as elimination gave directly, $\mathbf{w}=(3,2)$ — but now available instantly for <em>any</em> right-hand side, without repeating elimination from scratch.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Not every square matrix has an inverse. If $A$ is not full rank, Gauss-Jordan elimination will hit the same symptom seen earlier — a row on the left block reducing to all zeros — before the left side can ever become $I$. A matrix without an inverse is called <em>singular</em>; a matrix with one is <em>nonsingular</em> or <em>invertible</em>. This is the same rank condition from before, restated: $A^{-1}$ exists exactly when $A$ has full rank.
</div>

## The determinant

Gauss-Jordan elimination tells you definitively whether $A$ is invertible — but only after you've done the work. It would be useful to have a quick check, computable directly from $A$'s entries, that answers the yes/no question up front.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Determinant (2x2)</span></span>
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
Recall the singular case from earlier, where the third row was an exact combination of the first two. Restrict to just the first two rows and columns of that scenario, $A=\begin{bmatrix} 2 & 1 \\ 4 & 2 \end{bmatrix}$ — the second row is exactly twice the first, so no unique solution should exist. Check: $\det(A) = (2)(2)-(1)(4) = 4-4=0$. The determinant catches the singularity without any elimination at all.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Geometrically, $|\det(A)|$ measures how much $A$ stretches or shrinks area (in 2D) or volume (in higher dimensions) when it acts on vectors. A determinant of zero means $A$ collapses space into a lower dimension — squashing a 2D plane down onto a single line, for instance — which is exactly why no inverse can exist: information about the second dimension has been destroyed, and there's no way to recover it.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
The determinant formula grows more involved for larger matrices ($3\times3$ and up), and computing it directly becomes impractical by hand well before matrices reach the sizes political scientists actually work with. In practice, the determinant is rarely computed by the raw formula — it falls out of elimination almost for free, as the product of the pivots (up to a sign that tracks row swaps). The formula above is worth knowing by hand for the $2\times2$ case specifically, since it's what makes the invertibility condition concrete rather than abstract.
</div>

## Closing the loop

Return once more to the scholar's question, sitting untouched since the end of session 1: what weight vector best explains democracy score in terms of growth and EU integration? Session 1 gave a way to *write* that question precisely, as $A\mathbf{w}=\mathbf{b}$ for some matrix $A$ and vector $\mathbf{b}$ built from the data. This session gave a way to *answer* it — Gaussian elimination solves the system directly, and when $A$ is square and full rank, $\mathbf{w}=A^{-1}\mathbf{b}$ answers it for any $\mathbf{b}$ at all, with the determinant available as a fast check on whether that's even possible before doing the work.

There is still a gap, and it's worth naming honestly before session 3 closes it: the scholar's actual data matrix, the one built from six countries and two predictors, is not square. $A\mathbf{w}=\mathbf{b}$ as written doesn't quite apply — there are more countries than unknowns, and nothing built so far says what "solving" an equation like that even means when a clean, unique answer generally can't exist. That gap is exactly where session 3 picks up.