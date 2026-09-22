_Overview: Forthcoming._

<a class="resource-link" href="slides/laps_session_3.pdf" target="_blank" rel="noopener">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  Session 4 Slides (.pdf)
</a>

## What Does a Matrix Actually Do to Space?

Every matrix used so far has been a machine for a specific job: $A\mathbf{w}$ built composite scores, $X\beta$ built predictions. Step back for a moment and ask a more general question, true of every matrix: what does multiplying by $A$ actually *do* to a vector?

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
In general, $A\mathbf{v}$ points in a completely different direction from $\mathbf{v}$ itself, and has a different length. Multiplying by a matrix, in other words, typically rotates a vector <em>and</em> rescales it, both at once.
</div>

There is one very special exception to this, and it turns out to be enormously useful.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Eigenvector and Eigenvalue</span></span>
For a square matrix $A$, a nonzero vector $\mathbf{v}$ is an <em>eigenvector</em> of $A$ if
$$
A\mathbf{v} = \lambda\mathbf{v}
$$
for some scalar $\lambda$, called the corresponding <em>eigenvalue</em>. In words: $A$ doesn't rotate $\mathbf{v}$ at all — it only stretches or shrinks it, by a factor of $\lambda$.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Most vectors are not eigenvectors of a given $A$ — for a generic $\mathbf{v}$, $A\mathbf{v}$ points somewhere new. Eigenvectors are the special handful of directions (out of infinitely many) along which $A$'s entire effect collapses to simple scaling. They matter because they reveal $A$'s "natural axes" — the directions along which its behavior is easiest to describe, and, as this session will show, the directions along which a dataset's own variation is easiest to describe as well.
</div>

## Finding Eigenvalues and Eigenvectors

$A\mathbf{v}=\lambda\mathbf{v}$ is a definition, not yet a method — given a matrix $A$, how do you actually find its eigenvalues and eigenvectors?

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Rewrite the defining equation with everything on one side: $A\mathbf{v}-\lambda\mathbf{v}=\mathbf{0}$. To factor out $\mathbf{v}$, write $\lambda\mathbf{v}$ as $\lambda I\mathbf{v}$ (multiplying by the identity changes nothing, but now both terms are matrix-vector products):
$$
A\mathbf{v}-\lambda I\mathbf{v} = \mathbf{0} \quad\Longrightarrow\quad (A-\lambda I)\mathbf{v} = \mathbf{0}
$$
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This says $(A-\lambda I)$ sends the nonzero vector $\mathbf{v}$ to the zero vector — which, from Session 2, means $(A-\lambda I)$ is singular: its determinant must be zero. That gives a direct way to find every valid $\lambda$, with no guessing required.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Characteristic Equation</span></span>
The eigenvalues of $A$ are exactly the solutions $\lambda$ to
$$
\det(A-\lambda I) = 0
$$
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Let $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.

**Find the eigenvalues.**
$$
A-\lambda I = \begin{bmatrix} 2-\lambda & 1 \\ 1 & 2-\lambda \end{bmatrix}
$$
$$
\det(A-\lambda I) = (2-\lambda)^2 - 1 = 0 \quad\Longrightarrow\quad (2-\lambda)^2=1 \quad\Longrightarrow\quad 2-\lambda=\pm1
$$
So $\lambda=1$ or $\lambda=3$.

**Find the eigenvector for $\lambda=3$.** Plug back into $(A-\lambda I)\mathbf{v}=\mathbf{0}$:
$$
\begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \quad\Longrightarrow\quad -v_1+v_2=0 \quad\Longrightarrow\quad v_1=v_2
$$
So $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ (or any scalar multiple of it) is an eigenvector, with eigenvalue $3$.

**Find the eigenvector for $\lambda=1$.**
$$
\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \quad\Longrightarrow\quad v_1+v_2=0 \quad\Longrightarrow\quad v_1=-v_2
$$
So $\mathbf{v}_2 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$ is an eigenvector, with eigenvalue $1$.

**Check.** $A\mathbf{v}_1 = \begin{bmatrix} 2+1 \\ 1+2 \end{bmatrix} = \begin{bmatrix} 3 \\ 3 \end{bmatrix} = 3\mathbf{v}_1$ ✓, and $A\mathbf{v}_2 = \begin{bmatrix} 2-1 \\ 1-2 \end{bmatrix} = \begin{bmatrix} 1 \\ -1 \end{bmatrix} = 1\cdot\mathbf{v}_2$ ✓.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Notice something about $\mathbf{v}_1=(1,1)$ and $\mathbf{v}_2=(1,-1)$: they're perpendicular ($\mathbf{v}_1\cdot\mathbf{v}_2=1-1=0$). This isn't a coincidence of this particular example — it's a general fact about a special class of matrices, taken up next.
</div>

## Symmetric Matrices Are Special

The previous example wasn't chosen at random: $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ is symmetric ($A^\top=A$), and its eigenvectors came out perpendicular. This turns out to be a completely general fact about symmetric matrices — and it matters enormously, because a very familiar object from Session 3 is symmetric.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Recall from Session 1: for <em>any</em> matrix $M$, $M^\top M$ is symmetric. Session 3's variance-covariance matrix, $\Sigma=\frac{1}{n-1}\tilde Z^\top\tilde Z$, is built in exactly this form — so $\Sigma$ is symmetric, guaranteed, no matter what data it's built from.
</div>

<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span> <span class="callout-title">The Spectral Theorem</span></span>
If $S$ is a symmetric matrix, then:
<ol>
<li>All of $S$'s eigenvalues are real numbers (never complex).</li>
<li>Eigenvectors corresponding to different eigenvalues are orthogonal to each other.</li>
</ol>
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is a genuinely deep fact, and proving it carefully is beyond this course — but it's worth seeing, at least loosely, why orthogonality should be plausible. Suppose $S\mathbf{v}_1=\lambda_1\mathbf{v}_1$ and $S\mathbf{v}_2=\lambda_2\mathbf{v}_2$, with $\lambda_1\neq\lambda_2$. Using $S^\top=S$ and the transpose-reverses-order rule from Session 1:
$$
\lambda_1(\mathbf{v}_1\cdot\mathbf{v}_2) = (S\mathbf{v}_1)^\top\mathbf{v}_2 = \mathbf{v}_1^\top S^\top\mathbf{v}_2 = \mathbf{v}_1^\top S\mathbf{v}_2 = \mathbf{v}_1^\top(\lambda_2\mathbf{v}_2) = \lambda_2(\mathbf{v}_1\cdot\mathbf{v}_2)
$$
So $\lambda_1(\mathbf{v}_1\cdot\mathbf{v}_2)=\lambda_2(\mathbf{v}_1\cdot\mathbf{v}_2)$. Since $\lambda_1\neq\lambda_2$, the only way this can hold is if $\mathbf{v}_1\cdot\mathbf{v}_2=0$ — exactly orthogonality.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Why this matters here: $\Sigma$ is symmetric, so the Spectral Theorem applies to it directly. $\Sigma$'s eigenvectors are guaranteed to be real, perpendicular directions — and, as the next section shows, they turn out to be exactly the axes of the ellipse-shaped data cloud from Session 3's covariance-geometry picture.
</div>

## Closing the Loop on the Covariance-Geometry Picture

Session 3 showed a scatter cloud with a dashed ellipse sketched around it, and left something unresolved: the ellipse's *precise* shape — its axes, their lengths — was flagged as "eigenvalue territory," to be revisited later. That moment has arrived.

<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span> <span class="callout-title">Eigenvectors of $\Sigma$ Are the Ellipse's Axes</span></span>
For a symmetric variance-covariance matrix $\Sigma$, the ellipse describing the spread of the data cloud has its axes aligned exactly with $\Sigma$'s eigenvectors. The length of each axis is proportional to the square root of the corresponding eigenvalue.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is why the Spectral Theorem mattered: it guarantees $\Sigma$'s eigenvectors are real and orthogonal, which is exactly what "the axes of an ellipse" requires — an ellipse's two axes are, by definition, perpendicular to each other. A symmetric matrix is precisely the kind of object whose eigen-decomposition always produces a valid ellipse (or, in higher dimensions, an ellipsoid), never something geometrically nonsensical.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Recall the actual variance-covariance matrix of growth and EU integration, computed in Session 3:
$$
\Sigma = \begin{bmatrix} \tfrac{18}{5} & \tfrac{31}{5} \\ \tfrac{31}{5} & \tfrac{377}{30} \end{bmatrix} \approx \begin{bmatrix} 3.60 & 6.20 \\ 6.20 & 12.57 \end{bmatrix}
$$
Applying the same method as before — the characteristic equation $\det(\Sigma-\lambda I)=0$ — gives eigenvalues $\lambda_1\approx15.73$ and $\lambda_2\approx0.43$, with corresponding (unit-length) eigenvectors
$$
\mathbf{v}_1 \approx \begin{bmatrix} 0.455 \\ 0.890 \end{bmatrix}, \qquad \mathbf{v}_2 \approx \begin{bmatrix} -0.890 \\ 0.455 \end{bmatrix}
$$
(These particular numbers don't come out as cleanly as the earlier $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ example — the quadratic formula still applies, it just doesn't land on nice integers here. The method is identical either way.)
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Interpret this concretely. $\lambda_1\approx15.73$ is far larger than $\lambda_2\approx0.43$ — about $36\times$ bigger — meaning the data cloud is heavily stretched along $\mathbf{v}_1$ and barely spread at all along $\mathbf{v}_2$. And $\mathbf{v}_1\approx(0.455,0.890)$ leans much more heavily toward the integration axis (the second coordinate) than the growth axis: growth and integration move together strongly enough that almost all of the six countries' variation lives along one tilted direction, not spread evenly across both variables. This is the precise version of the "tilted cloud" picture from Session 3 — no longer just a qualitative sketch, but an exact direction and an exact ratio of spread.
</div>

## Principal Component Analysis

Session 1 opened with the scholar wanting a "Western alignment index" — a composite of growth and EU integration — and chose the weights $w_1=w_2=\tfrac12$ largely because they gave clean arithmetic (Estonia and Latvia's numbers happened to average out neatly). That choice was reasonable, but arbitrary: nothing about the *data itself* said the two variables deserved equal weight. Eigenvectors give a way to let the data choose the weights instead.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">First Principal Component</span></span>
The <em>first principal component</em> of a dataset is the eigenvector of its variance-covariance matrix $\Sigma$ corresponding to the <em>largest</em> eigenvalue. It is, among every possible direction a composite index could point, the one direction along which the data varies the most.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Why the largest eigenvalue specifically? Session 3 established that a large diagonal or off-diagonal entry in $\Sigma$ reflects a lot of spread or strong co-movement. The eigen-decomposition just did this precisely: it found the single direction that concentrates as much of that spread as possible into one number. A composite index built along this direction captures more of what's actually happening across the six countries than an arbitrarily chosen weighting ever could.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
$\mathbf{v}_1\approx(0.455,0.890)$, the eigenvector found a moment ago, <em>is</em> the first principal component — a data-driven alternative to the scholar's original $(0.5,0.5)$ weighting. Applying it to each country's centered growth and integration values gives a PC1 score:
<table>
<thead><tr><th>Country</th><th>Centered growth</th><th>Centered integration</th><th>PC1 score</th></tr></thead>
<tbody>
<tr><td>Armenia</td><td>$-2.00$</td><td>$-3.17$</td><td>$-3.73$</td></tr>
<tr><td>Azerbaijan</td><td>$-1.00$</td><td>$-4.17$</td><td>$-4.17$</td></tr>
<tr><td>Georgia</td><td>$-2.00$</td><td>$-2.17$</td><td>$-2.84$</td></tr>
<tr><td>Estonia</td><td>$2.00$</td><td>$3.83$</td><td>$4.32$</td></tr>
<tr><td>Latvia</td><td>$1.00$</td><td>$2.83$</td><td>$2.98$</td></tr>
<tr><td>Lithuania</td><td>$2.00$</td><td>$2.83$</td><td>$3.43$</td></tr>
</tbody>
</table>
Exactly as in Session 1's original story: the three South Caucasus countries land solidly negative, the three Baltic countries land solidly positive — but now the weighting producing that split ($0.455$ on growth, $0.890$ on integration) came directly from the geometry of the data itself, rather than being chosen by hand.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Notice the weight on integration ($0.890$) is nearly double the weight on growth ($0.455$) — echoing the earlier observation that the data cloud stretches much further along the integration-heavy direction. PCA is, in this sense, discovering something the equal-weighting index from Session 1 never could: that EU integration carries more of the actual variation separating these six countries than GDP growth does.
</div>

## Regression vs. PCA

Both regression and PCA reduce several variables down to one number via a weighted sum, and both come from finding an eigenvector-like solution of some matrix. It's worth being precise about how they differ, since it's easy to conflate them.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Regression's $\hat\beta$ answers: <em>which weighted combination of growth and integration best predicts democracy score?</em> It needs an outcome variable, $y$, to check its predictions against — without $y$, there's nothing for $\hat\beta$ to be "best" at. PCA's first principal component answers a different question entirely: <em>which direction captures the most variation within growth and integration themselves?</em> No outcome variable enters anywhere in that computation — $\Sigma$ is built purely from the predictors, with democracy score never mentioned.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is also visible in what each method optimizes. $\hat\beta$ minimizes $\|y-X\beta\|^2$ — distance to an external target. The first principal component maximizes the variance of the projected data — spread within the data's own geometry, nothing external at all. One is a supervised question (predict something), the other unsupervised (summarize something) — and it's not a coincidence that both reduce to solving an eigenvalue-flavored problem with a symmetric matrix ($X^\top X$ for regression, $\Sigma$ for PCA): whenever a question reduces to "find the best single direction," a symmetric matrix and its eigenvectors tend to be exactly the tool that answers it.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
For the scholar's specific project, this distinction has a direct payoff: PCA is the right tool for building a defensible <em>index</em> (Western alignment, say, as a single composite variable to use elsewhere), while regression is the right tool for asking whether that index, or its component variables, actually <em>predicts</em> something of interest, like democratization. They are not competing methods for the same question — they are the correct methods for two genuinely different questions, and a lot of applied confusion comes from reaching for one when the other is what the question actually calls for.
</div>

## Course Wrap-Up

Four sessions ago, this course opened with a USSR scholar noticing that the South Caucasus and the Baltics differed in both wealth and democracy — and, on top of that, differed in their relationship with the West. Answering the question that observation raised turned out to require building an entire toolkit from scratch, one piece at a time, each piece introduced exactly when the story needed it rather than all at once up front.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span> <span class="callout-title">The arc, in one pass</span></span>
Session 1 gave the raw material: vectors as data, matrices as datasets, the dot product as a weighted sum, and the geometric fact — cosine, orthogonality — that a weighted sum secretly encodes an angle. Session 2 gave the machinery to actually solve something built from that vocabulary: Gaussian elimination, rank, the inverse, the determinant — tools for square systems specifically. Session 3 closed the gap those tools left open: real data is never square, so we swapped "solve exactly" for "get as close as possible," derived that closeness geometrically as orthogonal projection, and watched it collapse into the normal equations — the exact same square-system machinery from Session 2, applied to $X^\top X$ instead of $X$ itself. This session took the same variance-covariance matrix used to quantify $\hat\beta$'s uncertainty and asked what it looks like geometrically, which led straight to eigenvectors, the spectral theorem, and principal component analysis.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Notice how rarely a genuinely new mathematical object was introduced after Session 1. Nearly everything since has been the same handful of ideas — the dot product, the transpose, $M^\top M$'s symmetry, the determinant — recombined and reapplied to a new question. The normal equations were session 2's inverse, aimed at $X^\top X$. Standard errors were the same $(X^\top X)^{-1}$, reused. PCA's eigenvectors were the same symmetric-matrix machinery that made the normal equations solvable in the first place, pointed at $\Sigma$ instead. Linear algebra earns its place in a political scientist's toolkit precisely because of this reuse: a small, fixed set of operations turns out to answer a surprisingly wide range of applied questions.
</div>
