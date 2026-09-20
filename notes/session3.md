_Overview: We derive the least-squares estimator from the normal equations, then quantify its uncertainty. In short, we witness the miracle of regression._

<a class="resource-link" href="slides/laps_session_3.pdf" target="_blank" rel="noopener">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  Session 3 Slides (.pdf)
</a>

## Regression Notation, At  Long Last

Up until this point, every system we have solved has been written as $A\mathbf{x}=\mathbf{b}$ (or $A\mathbf{w}=\mathbf{b}$), where $A$ is a square matrix. In other words, we have had equally as many equations as unknowns and elimination has always found a pivot in every row. Recall, however, that our USSR scholar's matrix has a slightly different shape (six rows, three columns). Indeed, for the most part, all matrices that political scientists use in applications will be longer than they are wide (i.e., more rows than columns).

How, then, do we work with systems of this nature? When we have more equations than unknowns, there is generally no single $\mathbf{x}$ that satisfies every equation simultaneously: once $\mathbf{x}$ is pinned down by as many equations as there are unknowns, the remaining equations have no freedom left to be satisfied by, and there's no reason at all that they should happen to hold anyway. This is the normal state of affairs for real data.

The right response is not to abandon the equation, but to adjust our own expectations. Rather than looking for an $\mathbf{x}$ that solves $A\mathbf{x}=\mathbf{b}$ exactly, we will look for the $\mathbf{x}$ that gets $A\mathbf{x}$ as close to $\mathbf{b}$ as any choice of $\mathbf{x}$ possibly could. Before making that idea precise, we will first introduce some new notation that is more in line with the convention. As you will see, it is completely analogous to all of the notation we have used so far.

Our fundamental system is still $A\mathbf{x}=\mathbf{b}$ "under the hood." We are simply adjusting the letters. The coefficient matrix $A$ is now going to be called $X$ (the <em>design matrix</em>, built from the predictors); the unknown vector $\mathbf{x}$ is called $\beta$ (the weights being solved for); and the right-hand side $\mathbf{b}$ is called $y$ (the outcome being predicted). Nothing about how the system behaves is different: the renaming is happening only because $X$, $\beta$, $y$ are what every regression textbook and every piece of statistical software calls these same three objects (and who are we to flout tradition...).

Recall our working model from Sessions 1 and 2: a weighted combination of growth and EU integration, $w_1(\text{growth})+w_2(\text{integration})$, calibrated against real democracy scores. Written for all six countries at once, in the new notation:
$$
X\beta = y
$$
where $X$ collects growth and integration across all six countries, $y$ is the vector of six democracy scores, and $\beta=(w_1,w_2)$ is the vector of unknown weights.

$$
X = \begin{bmatrix}
3 & 2 \\
4 & 1 \\
3 & 3 \\
7 & 9 \\
6 & 8 \\
7 & 8
\end{bmatrix}, \qquad \beta = \begin{bmatrix} w_1 \\ w_2 \end{bmatrix}, \qquad
y = \begin{bmatrix} 3 \\ 2 \\ 4 \\ 8 \\ 7 \\ 8 \end{bmatrix}
$$

$X\beta=y$ is six equations in two unknowns. Try to find $\beta=(w_1,w_2)$ satisfying all six at once:

$$
\begin{aligned}
3w_1 + 2w_2 &= 3 \\
4w_1 + w_2 &= 2 \\
3w_1 + 3w_2 &= 4 \\
7w_1 + 9w_2 &= 8 \\
6w_1 + 8w_2 &= 7 \\
7w_1 + 8w_2 &= 8
\end{aligned}
$$

Any two of these six equations allow us to solve for $w_1, w_2$ uniquely (this would be an ordinary square system, solvable by the exact methods from Session 2). The problem is the other four. Once $\beta$ is fixed by, say, the first two countries, there is no reason at all the remaining four equations should also hold. They involve the same two unknowns, already spoken for, with no freedom left to satisfy anything new.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Overdetermined System</span></span>
A system $X\beta=y$ is overdetermined when it has more equations than unknowns. Such a system is consistent only when $y$ happens to already lie in the column space of $X$ (a pure coincidence, so not something to expect from real data).
</div>

## Least Squares, Geometrically

As we've said, in the absence of an exact solution to $X\beta=y$, we will instead search for the $\beta$ that gets $X\beta$ as close as possible to $y$. Think of $y$ as a single vector in $6$-dimensional space: one coordinate per country. As $\beta=(w_1,w_2)$ ranges over every possible choice of weights, $X\beta$ sweeps out every vector reachable as a combination of $X$'s two columns. That set of reachable vectors is called the <em>column space</em> of $X$. Since $X$ only has two columns, it is a much smaller slice of the full $6$-dimensional space, no matter how $\beta$ is chosen. $y$, sitting wherever the real data happens to put it, has no reason to land exactly inside that slice.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Column Space</span></span>
The column space of a matrix $X$ is the set of all vectors that can be written as $X\beta$ for some choice of $\beta$. Equivalently, it is every linear combination of $X$'s columns.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
"As close as possible" now has a clear geometric meaning: among every vector in the column space of $X$, which one is nearest to $y$? The answer, whenever "nearest" means ordinary straight-line distance, is always the same construction: we drop a perpendicular line from $y$ down onto the column space, and the point where it lands is the closest point achievable. That closest point is $X\hat\beta$, for whichever $\hat\beta$ achieves it; the leftover piece, the perpendicular segment itself, is the residual $e=y-X\hat\beta$.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Orthogonal Projection (Least Squares)</span></span>
The least-squares solution $\hat\beta$ is the value of $\beta$ that minimizes the length of the residual, $\|y-X\beta\|$. Geometrically, $X\hat\beta$ is the orthogonal projection of $y$ onto the column space of $X$: the closest point in that space to $y$, found by dropping a perpendicular line.

<details class="collapsible">
<summary>Why is the Perpendicular Point Necessarily the Closest One?</summary>
<div class="collapsible__content">

Suppose $X\hat\beta$ is the point in the column space of $X$ where $e=y-X\hat\beta$ happens to be perpendicular to the entire column space. Take any *other* point in the column space, $X\beta$, for some different $\beta$.

The segment connecting $X\hat\beta$ to $X\beta$ lies entirely inside the column space: both endpoints are combinations of $X$'s columns, and the column space is flat, so the segment between them is too. But $e$ is perpendicular to *everything* in the column space, including this specific segment. So the three points $y$, $X\hat\beta$, $X\beta$ form a right triangle, with the right angle sitting exactly at $X\hat\beta$.

The Pythagorean theorem then gives
$$
\|y-X\beta\|^2 = \|y-X\hat\beta\|^2 + \|X\hat\beta-X\beta\|^2
$$
The second term on the right is a squared length, so it's never negative, and it's exactly $0$ only when $X\beta=X\hat\beta$. So
$$
\|y-X\beta\|^2 \geq \|y-X\hat\beta\|^2
$$
for every other choice of $\beta$, with equality only when $\beta=\hat\beta$. The Pythagorean theorem basically forces the perpendicular point to be the closest point (and the unique one).

</div>
</details>
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Fitted Values</span></span>
$X\hat\beta$ itself is called $\hat y$: the vector of <em>fitted</em> (or <em>predicted</em>) values, as opposed to $y$, the vector of actually observed outcomes:
$$
\hat y = X\hat\beta
$$
$\hat y$ and $X\hat\beta$ are the same object; $\hat y$ is simply the lighter notation for it. The residual is, correspondingly, $e=y-\hat y$.
</div>

## The Normal Equations

We now know $\hat\beta$ is characterized geometrically: $e=y-X\hat\beta$ must be perpendicular to the entire column space of $X$. But "perpendicular to an entire plane" is not a condition we can plug into an equation directly: how do we convert this into a finite and verifiable condition?

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
In order to be perpendicular to an entire plane, it is enough to be perpendicular to whatever <em>spans</em> that plane. This is because dot products distribute over addition and scalar multiplication: if $e$ is perpendicular to $\mathbf{x}_1$ and perpendicular to $\mathbf{x}_2$ individually, then for <em>any</em> combination $\beta_1\mathbf{x}_1+\beta_2\mathbf{x}_2$ (i.e. any point in the column space):
$$
e\cdot(\beta_1\mathbf{x}_1+\beta_2\mathbf{x}_2) = \beta_1(e\cdot\mathbf{x}_1) + \beta_2(e\cdot\mathbf{x}_2) = \beta_1(0)+\beta_2(0) = 0
$$
So $e$ ends up perpendicular to <em>every</em> point in the column space automatically, just by being perpendicular to the two columns that generate it. Checking infinitely many directions collapses to checking just two.
</div>

Recall from session 1 that two vectors are orthogonal exactly when their dot product is zero: this is what lets us turn "$e$ perpendicular to the column space" into something computable.

Let $\mathbf{x}_1, \mathbf{x}_2$ be the two columns of $X$ (growth and integration). By the argument above, $e$ perpendicular to the column space reduces to exactly two conditions: $e$ perpendicular to each column on its own:
$$
\mathbf{x}_1 \cdot e = 0, \qquad \mathbf{x}_2 \cdot e = 0
$$

Stacking two dot products against the same vector into one line is exactly what matrix-vector multiplication does (Session 1 strikes again): computing $\mathbf{x}_1\cdot e$ and $\mathbf{x}_2\cdot e$ simultaneously is the same as dotting $e$ against each <em>row</em> of $X^\top$ (since $X^\top$'s rows are exactly $X$'s columns, $\mathbf{x}_1$ and $\mathbf{x}_2$). So the two conditions together say precisely
$$
X^\top e = 0
$$

<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span> <span class="callout-title">Normal Equations</span></span>
Substituting $e=y-X\hat\beta$ into $X^\top e=0$:
$$
X^\top(y-X\hat\beta)=0 \quad\Longrightarrow\quad X^\top X\hat\beta = X^\top y
$$
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Let us carefully observe what just happened to the shape of the problem. $X$ was $6\times2$ (not square). $X^\top X$, on the other hand, is $2\times2$: square. Every tool we discussed in Session 2 (Gaussian elimination, rank, the inverse, the determinant) was built for exactly this shape, and now applies to $X^\top X$ without modification. The overdetermined, unsolvable system $X\beta=y$ has been converted into an ordinary square system, $X^\top X\hat\beta=X^\top y$, of a kind we already know how to solve!
</div>

Provided $X^\top X$ is invertible (which Session 2 already says exactly how to check, via its determinant or via elimination finding a full set of pivots) the solution follows immediately:
$$
\hat\beta = (X^\top X)^{-1}X^\top y
$$

How beautiful!

## A Numerical Example

The full six-country system lives in $6$-dimensional space, which is too many dimensions to draw. But the same projection happens in any number of dimensions, so we can verify that it works in a case small enough to see completely, using just three countries: Armenia, Georgia, and Latvia. As before, $X$'s two columns are growth and EU integration, and $y$ is the democracy score we're trying to predict.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
$$
X = \begin{bmatrix} 3 & 2 \\ 3 & 3 \\ 6 & 8 \end{bmatrix}, \qquad y = \begin{bmatrix} 3 \\ 4 \\ 7 \end{bmatrix}
$$

We begin by forming the normal equations.

$$
X^\top X = \begin{bmatrix} 3 & 3 & 6 \\ 2 & 3 & 8 \end{bmatrix}\begin{bmatrix} 3 & 2 \\ 3 & 3 \\ 6 & 8 \end{bmatrix} =  \begin{bmatrix} 54 & 63 \\ 63 & 77 \end{bmatrix}, \qquad
X^\top y = \begin{bmatrix} 3 & 3 & 6 \\ 2 & 3 & 8 \end{bmatrix}\begin{bmatrix} 3 \\ 4 \\ 7 \end{bmatrix} = \begin{bmatrix} 63 \\ 74 \end{bmatrix}
$$

We now solve: $X^\top X\hat\beta = X^\top y$ (by elimination or the inverse, either from Session 2):
$$
\hat\beta = \begin{bmatrix} 1 \\ \tfrac17 \end{bmatrix}
$$
This is the vector of weights: $\hat\beta = (\hat w_1, \hat w_2)$. We now know exactly how much to weight GDP Growth and EU Integration in this (three-country) model: $1$ and $\tfrac17$, respectively. Growth is doing essentially all the work here, with integration contributing only a small additional adjustment.

We now compute the projection, $\hat y = X\hat\beta$:
$$
\hat y = \begin{bmatrix} 3(1)+2(\tfrac17) \\ 3(1)+3(\tfrac17) \\ 6(1)+8(\tfrac17) \end{bmatrix} = \begin{bmatrix} \tfrac{23}{7} \\ \tfrac{24}{7} \\ \tfrac{50}{7} \end{bmatrix}
$$
Notice this is close to $y=(3,4,7)$, but not equal to it. The gap between them, $y-\hat y$, is the residual $e$ we have been building toward: the part of $y$ that growth and integration, weighted this way, simply can't account for. We compute it explicitly next.

$$
e = y - \hat y = \begin{bmatrix} -\tfrac27 \\ \tfrac47 \\ -\tfrac17 \end{bmatrix}
$$

Now we check to make sure that the residual is indeed orthogonal to both columns of $X$, which is the geometric fact that this whole method rests on:
$$
\mathbf{x}_1\cdot e = 3\left(-\tfrac27\right)+3\left(\tfrac47\right)+6\left(-\tfrac17\right) = -\tfrac67+\tfrac{12}7-\tfrac67 = 0
$$
$$
\mathbf{x}_2\cdot e = 2\left(-\tfrac27\right)+3\left(\tfrac47\right)+8\left(-\tfrac17\right) = -\tfrac47+\tfrac{12}7-\tfrac87 = 0
$$
Since both dot products are equal to zero, the residual really is perpendicular to the column space, as expected.
</div>

## Variance-Covariance Matrices

So far, every use of $X^\top X$ has been in service of finding $\hat\beta$. But this exact construction (a matrix multiplied by its own transpose) is the right tool for a different set of questions, too: how spread out is a variable, and how do two variables move together? This also turns out to be exactly what is needed to answer a question about $\hat\beta$ itself, which we have now derived but not discussed at length.
<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Recall the sample variance formula from introductory statistics: $\text{Var}(x) = \dfrac{1}{n-1}\sum_{i=1}^n(x_i-\bar x)^2$: the average squared distance of each observation from the mean. Look at that sum through the lens of the dot product. If $\tilde{\mathbf{x}}$ is the <em>centered</em> version of $x$ (its mean subtracted from every entry, $\tilde x_i = x_i-\bar x$), then
$$
\tilde{\mathbf{x}}\cdot\tilde{\mathbf{x}} = \sum_{i=1}^n \tilde x_i^2 = \sum_{i=1}^n (x_i-\bar x)^2
$$
which is exactly the numerator of the variance formula — the dot product only ever produces a sum, so the $\dfrac{1}{n-1}$ still needs to be tacked on separately to get the actual variance. So variance is nothing more than a centered column dotted with itself, divided by $n-1$. The same logic extends to two different variables: $\tilde{\mathbf{x}}\cdot\tilde{\mathbf{y}} = \sum_i(x_i-\bar x)(y_i-\bar y)$ is the numerator of <em>covariance</em>: how two variables move together, rather than how one variable spreads out on its own.
</div>
<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Variance-Covariance Matrix</span></span>
Suppose we have $k$ variables, each centered as above: $\tilde{\mathbf{z}}_1,\dots,\tilde{\mathbf{z}}_k$. The variance-covariance matrix $\Sigma$ is the $k\times k$ matrix whose $(i,j)$ entry is exactly the computation from the remark above, applied to variables $i$ and $j$:
$$
\Sigma_{ij} = \frac{1}{n-1}\,\tilde{\mathbf{z}}_i\cdot\tilde{\mathbf{z}}_j
$$
When $i=j$, this is variable $i$'s own variance; when $i\neq j$, it's the covariance between variables $i$ and $j$. If $\tilde Z$ is the matrix whose columns are $\tilde{\mathbf{z}}_1,\dots,\tilde{\mathbf{z}}_k$, then all $k^2$ of these dot products are computed at once by
$$
\Sigma = \frac{1}{n-1}\tilde Z^\top\tilde Z
$$
exactly as $X^\top X$ computed every pairwise dot product among $X$'s columns in the normal equations.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
$\Sigma$ is symmetric for the same reason any $M^\top M$ is symmetric, which we established in Session 1: $(\tilde{Z}^\top\tilde{Z})^\top = \tilde{Z}^\top(\tilde{Z}^\top)^\top = \tilde{Z}^\top\tilde{Z}$. Substantively, this simply says the covariance between variable $i$ and variable $j$ is, by the dot product's own definition, identical to the covariance between $j$ and $i$.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
For growth and integration alone, $\Sigma$ is a $2\times2$ matrix:
$$
\Sigma = \begin{bmatrix} \text{Var(growth)} & \text{Cov(growth, integration)} \\ \text{Cov(integration, growth)} & \text{Var(integration)} \end{bmatrix}
$$
One matrix, built the same way as $X^\top X$ above, holds every variance and every covariance among a set of variables simultaneously.
</div>

The above example generalizes past two variables without any change in form: for $k$ variables, $\Sigma$ is $k\times k$, and every question about spread or co-movement among them lives in this one object. 

So why build $\Sigma$ at all? $\hat\beta$ is itself a vector of several numbers ($w_1$, $w_2$), each one an <em>estimate</em> from one particular sample of countries. A different sample would give a slightly different $\hat\beta$. Asking how much $\hat\beta$ varies (and whether $w_1$ and $w_2$'s estimation errors move together) is a variance-covariance question, just applied to $\hat\beta$ instead of to growth or integration directly. This is exactly what the remainder of this section computes: not the variance-covariance matrix of the data, but of $\hat\beta$ itself.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span> <span class="callout-title">The True Model</span></span>
You've already seen the equation $y=X\beta+\varepsilon$ in Quant I: $\beta$ is the true, unknown relationship connecting growth and integration to democracy, and $\varepsilon$ is everything left over (measurement error, omitted factors, etc.). We will assume each entry of $\varepsilon$ has some fixed but unknown variance, $\sigma^2$. This $\sigma^2$ is the same for every country, and it is independent of every other country's error.
<br><br>
What is new here is what we have actually been doing since the normal equations: computing $\hat\beta$, our best guess at that true $\beta$, from one particular sample of $y$. A different sample would hand us a different guess. Quantifying exactly how much that guess should be expected to vary is what the rest of this section does.
</div>


Substitute $y=X\beta+\varepsilon$ directly into the formula for $\hat\beta$:
$$
\hat\beta = (X^\top X)^{-1}X^\top y = (X^\top X)^{-1}X^\top(X\beta+\varepsilon) = \beta + (X^\top X)^{-1}X^\top\varepsilon
$$
So $\hat\beta$ differs from the true $\beta$ by exactly $(X^\top X)^{-1}X^\top\varepsilon$: a fixed matrix, $(X^\top X)^{-1}X^\top$, multiplied by the random error $\varepsilon$. All of $\hat\beta$'s uncertainty comes from that one term.


<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Variance of a Linear Transformation</span></span>
For a fixed matrix $A$ and a random vector $\mathbf{z}$ with variance-covariance matrix $\Sigma$,
$$
\text{Var}(A\mathbf{z}) = A\Sigma A^\top
$$
This is the matrix version of the familiar scalar fact $\text{Var}(aZ) = a^2\text{Var}(Z)$. $A$ appears once on each side, playing the role $a$ and $a$ again play in the scalar version.
</div>

<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span> <span class="callout-title">Variance of the OLS Estimator</span></span>
Let $A=(X^\top X)^{-1}X^\top$, so $\hat\beta-\beta = A\varepsilon$. Then
$$
\text{Var}(\hat\beta) = A(\sigma^2I)A^\top = \sigma^2 AA^\top
$$
Compute $AA^\top$ directly:
$$
AA^\top = (X^\top X)^{-1}X^\top\Big(X(X^\top X)^{-1}\Big) = (X^\top X)^{-1}(X^\top X)(X^\top X)^{-1} = (X^\top X)^{-1}
$$
So, we have:
$$
\text{Var}(\hat\beta) = \sigma^2(X^\top X)^{-1}
$$
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Notice which matrix just reappeared: $(X^\top X)^{-1}$, the exact object computed to find $\hat\beta$ itself. Nothing new needs to be inverted to get the uncertainty of the estimate. The very same inversion that produced the point estimate also produces its variance-covariance matrix, once multiplied by the single unknown scalar $\sigma^2$ (in practice, estimated from the residuals).
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span> <span class="callout-title">Where $\hat\sigma^2$ Comes From</span></span>
$\sigma^2=\text{Var}(\varepsilon)$ can't be computed directly, for the same reason $\varepsilon$ itself can't be observed: both are defined in terms of the true, unknown $\beta$. What we have instead is the residual $e=y-X\hat\beta$, which is computable, since it only needs $\hat\beta$, not $\beta$. Because $\hat\beta$ is our best estimate of $\beta$, $e$ is correspondingly our best estimate of $\varepsilon$, and it's what gets used in place of $\varepsilon$ to estimate $\sigma^2$:
$$
\hat\sigma^2 = \frac{1}{n-k}\sum_{i=1}^n e_i^2
$$
where $n$ is the number of observations and $k$ the number of predictors. The divisor $n-k$, rather than $n$, is the same kind of correction as the $n-1$ in the ordinary sample variance formula: each predictor estimated from the data costs one degree of freedom. 
</div>

## Standard Errors and Collinearity

$\text{Var}(\hat\beta)$ for our working example is a $2\times2$ matrix: one entry for each pair among $w_1,w_2$. Reading off the uncertainty of a single coefficient, on its own, just means looking at one entry of it.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Standard Error</span></span>
The standard error of a coefficient $\hat\beta_j$ is the square root of the corresponding diagonal entry of $\text{Var}(\hat\beta)=\sigma^2(X^\top X)^{-1}$:
$$
\text{SE}(\hat\beta_j) = \sqrt{\sigma^2\left[(X^\top X)^{-1}\right]_{jj}}
$$
</div>


This is the number that ends up in parentheses under a coefficient in a regression table. It is now visibly nothing more than a diagonal entry of a matrix already computed in the course of finding $\hat\beta$ itself, scaled by $\sigma^2$.

This closes a loop left open in Session 2. There, a rank-deficient $X^\top X$ (growth and integration reported on two different scales, or any other exact linear dependency among predictors) meant $(X^\top X)^{-1}$ didn't exist at all, and $\hat\beta$ was simply undefined. Real predictors are rarely <em>exactly</em> collinear, but they can be <em>nearly</em> so. In that case $X^\top X$ is not singular, so $(X^\top X)^{-1}$ still exists, but barely. The entries of $(X^\top X)^{-1}$ grow very large as $X^\top X$ approaches singularity, and since standard errors are square roots of exactly those entries, near-collinear predictors produce enormous standard errors.


## Closing the Loop

If Session 1 gave us the raw materials and heavy machinery (vectors, matrices, the dot product), Session 2 gave us a license to operate, by showing us how to solve systems of linear equations via Gaussian elimination. However, those systems were only square, while our scholar's actual matrix, six countries by two predictors, is clearly not square (and, indeed, neither are most matrices used by political scientists in practice).

In this session, we have closed that gap. An overdetermined system like $X\beta=y$ generally has no exact solution, so we adjusted our expectations: instead of solving for $\beta$ exactly, we try to get as close as any $\beta$ possibly could. In order to do so, we dropped a perpendicular line from $y$ onto the column space of $X$. Once translated into dot products, this condition collapsed into a single square system: the normal equations, $X^\top X\hat\beta=X^\top y$. Every tool built in Session 2 (elimination, the inverse, the determinant) applied to that system without modification, and $\hat\beta=(X^\top X)^{-1}X^\top y$ fell out directly.

Since $\hat\beta$ is only as good as the one sample of $y$ it was built from, we did not stop at the point estimate. Quantifying the uncertainty associated with $\hat\beta$ turned out to lean on the exact same construction, $M^\top M$, that produced the normal equations in the first place: $\text{Var}(\hat\beta)=\sigma^2(X^\top X)^{-1}$, the same inverted matrix already sitting in hand. This gave a precise account of something every applied researcher eventually runs into under a vaguer name: near-collinear predictors cause $(X^\top X)^{-1}$ (and standard errors along with it) to blow up.