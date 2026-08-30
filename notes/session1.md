_Overview: Introduction of the section content._

### Motivation: Why Study Linear Algebra?

Many questions in political science result from a conviction that multiple things are related to one another. A scholar specializing in the USSR, for example, might notice that the countries of the South Caucasus (Armenia, Azerbaijan, and Georgia), have both weak economies and weak democracies, while the countries of the Baltics (Estonia, Latvia, and Lithuania), have strong(er) economies and strong(er) democracies. He has arrived at one of the classic questions in comparative politics: Why does sustained economic growth seem to increase the likelihood of democratization?


But, this scholar notes, the Baltics and the South Caucasus also differ in a third way: proximity to the West. The Baltics were fast-tracked into EU accession; the South Caucasus states largely were not. So is economic growth really driving democratization, or are both being pulled along by a country's relationship with the West? At this point, the scholar may start collecting some preliminary data.

<table>
<thead>
<tr><th>Country</th><th>Region</th><th>GDP Growth</th><th>EU Integration</th><th>Democracy Score</th></tr>
</thead>
<tbody>
<tr><td>Armenia</td><td>South Caucasus</td><td>3</td><td>2</td><td>3</td></tr>
<tr><td>Azerbaijan</td><td>South Caucasus</td><td>4</td><td>1</td><td>2</td></tr>
<tr><td>Georgia</td><td>South Caucasus</td><td>3</td><td>3</td><td>4</td></tr>
<tr><td>Estonia</td><td>Baltics</td><td>7</td><td>9</td><td>8</td></tr>
<tr><td>Latvia</td><td>Baltics</td><td>6</td><td>8</td><td>7</td></tr>
<tr><td>Lithuania</td><td>Baltics</td><td>7</td><td>8</td><td>8</td></tr>
</tbody>
</table>

Ultimately, our scholar wants to know the following things:
1. How much does **GDP Growth** influence **Democracy Score**?
2. How much does **EU Integration** influence **Democracy Score**?
3. How much does **GDP Growth** influence **Democracy Score**, when **EU Integration** is held constant?

He should be patient. We will get there. In the meantime, take a look at the following object.

$$
A = 
\begin{bmatrix}
3 & 2 & 3 \\
4 & 1 & 2 \\
3 & 3 & 4 \\
7 & 9 & 8 \\
6 & 8 & 7 \\
7 & 8 & 8
\end{bmatrix}

$$

You will notice that $A$ contains exactly the numbers from the table above. Once we've stripped away the country names and the region labels, what remains is a rectangular grid of numbers, one row per country, one column per variable. This grid is called a **matrix**. It didn't require any new mathematics to produce; it was sitting inside the table the whole time! Indeed, all datasets in a tabular format are matrices.

This turns out to matter a great deal. The scholar's three questions about the world are actually questions about this  matrix $A$. In particular: how do the *columns* of $A$ relate to one another? Does the growth column move together with the democracy column? And does that relationship survive once the EU integration column is accounted for? In order to obtain precise quantitative answers to questions like these, we need to be able to isolate a single column, combine columns together, and compare one column's movement against another's. A single column of a matrix, on its own, is exactly what we will soon call a **vector**.

So the plan for the next four sessions is this: before we can answer *why* growth and democracy move together, or *whether* EU integration explains it away, we need a working vocabulary for objects like $A$ and its columns. Vectors and matrices are the two fundamental objects of linear algebra. Once we know how to manipulate them, combine them, and eventually solve for unknowns using them, we will be able to answer precisely how much weight each column deserves in explaining the last one.

### Vectors

Recall the matrix $A$ from before: six countries, three columns of numbers. Take just one column on its own, say the GDP growth column:

$$
\mathbf{x} = \begin{bmatrix} 3 \\ 4 \\ 3 \\ 7 \\ 6 \\ 7 \end{bmatrix}
$$

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span>  <span class="callout-title">Vector</span></span>
A vector is an ordered list of numbers. We write vectors as lowercase bold letters ($\mathbf{x}$) and their individual entries with subscripts ($x_1, x_2, \dots, x_n$). A vector with $n$ entries is said to have <em>dimension</em> $n$, or to live in $\mathbb{R}^n$.
</div>

$\mathbf{x}$ is simply the GDP growth column, isolated from the rest of the table. This is the first thing worth internalizing about vectors: in political science, a vector is very often just *one variable, across every observation in your dataset*. The democracy score column is a vector. The EU integration column is a vector. Even a single country's full profile (reading across a row instead of down a column) is a vector:

$$
\mathbf{a}_{\text{Armenia}} = \begin{bmatrix} 3 \\ 2 \\ 3 \end{bmatrix}
$$

### Matrices

We have already met $A$: the six-country, three-variable table from the introduction. Now, more precisely:

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-num">1.2</span>: <span class="callout-title">Matrix</span></span>
A matrix is a rectangular array of numbers, arranged in rows and columns. We write matrices as uppercase letters ($A$), and refer to the size of a matrix as $m \times n$, meaning $m$ rows and $n$ columns. The entry in row $i$, column $j$ is written $a_{ij}$.
</div>

$$
A = 
\begin{bmatrix}
3 & 2 & 3 \\
4 & 1 & 2 \\
3 & 3 & 4 \\
7 & 9 & 8 \\
6 & 8 & 7 \\
7 & 8 & 8
\end{bmatrix}
$$

$A$ is $6 \times 3$: six rows (one per country), three columns (one per variable). The entry $a_{42} = 9$ is the value in row 4, column 2 (Estonia's EU integration score).

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
A matrix is a collection of vectors, side by side. $A$'s three columns are three vectors in $\mathbb{R}^6$; $A$'s six rows are six vectors in $\mathbb{R}^3$. A vector, in fact, is just a matrix with only one column ($n=1$), which is why it's common to see a vector written as an $n \times 1$ matrix.
</div>

### Vector Operations: Addition and Scalar Multiplication

Two vectors of the same dimension can be added, entry by entry.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-num">1.3</span>: <span class="callout-title">Vector Addition</span></span>
If $\mathbf{u} = \begin{bmatrix} u_1 \\ \vdots \\ u_n \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} v_1 \\ \vdots \\ v_n \end{bmatrix}$, then
$$
\mathbf{u} + \mathbf{v} = \begin{bmatrix} u_1 + v_1 \\ \vdots \\ u_n + v_n \end{bmatrix}
$$
Addition is only defined when $\mathbf{u}$ and $\mathbf{v}$ have the same number of entries.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span> Vector Addition</span>
Call the GDP Growth and EU Integration column vectors $\mathbf{x}_1$ and $\mathbf{x}_2$, respectively, and add them together.

<details class="collapsible">
<summary>Solution</summary>

$$
\mathbf{x}_1 = \begin{bmatrix} 3 \\ 4 \\ 3 \\ 7 \\ 6 \\ 7 \end{bmatrix}, \qquad
\mathbf{x}_2 = \begin{bmatrix} 2 \\ 1 \\ 3 \\ 9 \\ 8 \\ 8 \end{bmatrix}
$$
$$
\implies \mathbf{x}_1 + \mathbf{x}_2 = \begin{bmatrix} 5 \\ 5 \\ 6 \\ 16 \\ 14 \\ 15 \end{bmatrix}
$$
This is a real (if crude) composite score: each country's growth and integration values summed together. Whether that sum is a *meaningful* quantity is a modeling question, not a mathematical one; the operation itself is unambiguous.
</div>
</div>
</details>

A vector can also be rescaled by an ordinary number.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Scalar Multiplication</span></span>
For a number $c$ (called a <em>scalar</em> to distinguish it from a vector) and a vector $\mathbf{v}$,
$$
c\mathbf{v} = \begin{bmatrix} cv_1 \\ \vdots \\ cv_n \end{bmatrix}
$$
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span> Scalar Multiplication</span>
If the democracy score were instead reported on a 0–20 scale rather than 0–10, every entry would simply double: $2\mathbf{y}$, where $\mathbf{y}$ is the original democracy score column. Rescaling a variable (e.g., converting units, standardizing, normalizing to a 0–1 range) is scalar multiplication. We could also combine this with addition, to shift the values as well as stretch them. Once again, this is more a modeling question than a mathematical one.
</div>

### The Dot Product


<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span>  <span class="callout-title">Dot Product</span></span>
For two vectors of the same dimension, $\mathbf{u} = \begin{bmatrix} u_1 \\ \vdots \\ u_n \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} v_1 \\ \vdots \\ v_n \end{bmatrix}$,
$$
\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^n u_iv_i = u_1v_1 + u_2v_2 + \cdots + u_nv_n
$$
Multiply corresponding entries, then add up the results. Like addition, the dot product is only defined when both vectors have the same number of entries.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span>  <span class="callout-title">A Weighted Composite</span></span>
Take the GDP growth and EU integration columns as before:
$$
\mathbf{x}_1 = \begin{bmatrix} 3 \\ 4 \\ 3 \\ 7 \\ 6 \\ 7 \end{bmatrix}, \qquad
\mathbf{x}_2 = \begin{bmatrix} 2 \\ 1 \\ 3 \\ 9 \\ 8 \\ 8 \end{bmatrix}
$$
Then
$$
\mathbf{x}_1 \cdot \mathbf{x}_2 = (3)(2) + (4)(1) + (3)(3) + (7)(9) + (6)(8) + (7)(8) = 6+4+9+63+48+56 = 186
$$
On its own, 186 isn't a quantity with an obvious substantive meaning—but hold that thought! The dot product's real use is not computing one number in isolation, but what happens when one of the two vectors is a set of *weights*. This will make sense soon.
</div>
<div class="callout example">
<span class="label"><span class="callout-type">Example</span> <span class="callout-title">A Single Country's Weighted Score</span></span>
Suppose we want to combine a country's growth and EU integration into one composite index, giving growth twice the weight of integration. Write that choice as a weight vector, $\mathbf{w} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$. For Georgia, whose growth and integration values are $\begin{bmatrix} 3 \\ 3 \end{bmatrix}$:
$$
\mathbf{w} \cdot \begin{bmatrix} 3 \\ 3 \end{bmatrix} = (2)(3) + (1)(3) = 9
$$
Every entry of the data vector got multiplied by its corresponding weight, and the results were summed into a single composite number for Georgia. This is the pattern to hold onto: a dot product between a weight vector and a data vector produces one weighted combination.
</div>

### Matrix-Vector Multiplication

Example 1.4 computed a weighted composite score for Georgia alone. But our scholar has six countries, not just one, and recomputing that dot product by hand, country by country, is exactly the kind of repetition vectors and matrices exist to eliminate.

Collect the growth and EU integration columns side by side into a $6 \times 2$ matrix:

$$
M = 
\begin{bmatrix}
3 & 2 \\
4 & 1 \\
3 & 3 \\
7 & 9 \\
6 & 8 \\
7 & 8
\end{bmatrix}
$$

Each row of $M$ is one country's (growth, integration) pair: the same pair Example 1.4 dotted with $\mathbf{w} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$ for Georgia alone. Matrix-vector multiplication is what happens when you do that same dot product against *every row at once*.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span>  <span class="callout-title">Matrix-Vector Multiplication</span></span>
For an $m \times n$ matrix $M$ and an $n \times 1$ vector $\mathbf{w}$, the product $M\mathbf{w}$ is the $m \times 1$ vector whose $i$-th entry is the dot product of $M$'s $i$-th row with $\mathbf{w}$:
$$
(M\mathbf{w})_i = \sum_{j=1}^n M_{ij}w_j
$$
This is only defined when the number of columns in $M$ matches the number of entries in $\mathbf{w}$ — each row needs a matching weight to dot against.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span>  <span class="callout-title">A Composite Score for Every Country, At Once</span></span>
$$
M\mathbf{w} = 
\begin{bmatrix}
3 & 2 \\
4 & 1 \\
3 & 3 \\
7 & 9 \\
6 & 8 \\
7 & 8
\end{bmatrix}
\begin{bmatrix} 2 \\ 1 \end{bmatrix}
=
\begin{bmatrix}
(3)(2)+(2)(1) \\
(4)(2)+(1)(1) \\
(3)(2)+(3)(1) \\
(7)(2)+(9)(1) \\
(6)(2)+(8)(1) \\
(7)(2)+(8)(1)
\end{bmatrix}
=
\begin{bmatrix} 8 \\ 9 \\ 9 \\ 23 \\ 20 \\ 22 \end{bmatrix}
$$
Notice the third entry, 9 (Georgia's composite score) matches Example 1.4 exactly. Nothing new was computed; six dot products that we'd otherwise have written out separately were performed in one line, against the same weight vector $\mathbf{w}$.
</div>


### Closing the Loop