# NoneRegular Map Generator

Following this algorithm [form the developper of TownScraper](https://www.youtube.com/watch?v=1hqt8JkYRdI&feature=youtu.be)

## Inside 

**First step**: Build hexagonal tiling using [this](https://www.redblobgames.com/grids/hexagons/)
In short  : 

1. just shearing a rectangulal grid will give us what we need. 
![sheared grid](screenshot1.png)
2. Merge closest vertices into edges 
![triangle](screenshot2.png)
3. Merge triplet of edges in triangle

**Second Step** Randomly megre two adjacent triangles into one quad
![triangle randomly selected to merge](screenshot3.png)

The random algorithm is quite simple : take a lint of int corresponding to the id of each link. 
Randomly pick two elements of the list and swap them. Repeat this as many time as you want. 
Start at the top of the list and merge triangle in the ordre specify by your shuffled list.
This process is a bit clumssy and lead to triangle that cannot be merged.
The border has hole and you find some alone triangle inside the quads. Which is not what we wanted

We will get on our feed with the next step. We will sub-divide quad into 4 but we can sub dived triangle into 3 quad. 
The quand are ment to be perfect or pretty, this will be done with the last step

**example** 

```
|\
| \
|  \
|\  \
| \ _\
|  |  \
|__|___\

```
![triangle not randomly selected to merge](screenshot4.png)
With no random we have all the triangle merged which is nice. We will deal with the randomness later

**Third Step** Sub dividing quad into 4 smaller quad and triangle into 3 quad
![subdividie](screenshot5.png)

**Fourth Step** Relaxing quad to have more smooth grid

Here what we are going to use : 

1. List all the points.
2. Quads should list point by indexing the first list
3. Build a list of quads by points
4. Build a list of neighbour points by points
5. Choose a relaxing function on each point. This function should not modify the initial list but build a new one
6. Apply your function until no points move

Here step 4 illustrated 

![point and link to their neighbour](screenshot6.png)

## Demo Usage

### Setup
- `npm install`
- Have LOVE installed in path

### Running
- `npm run start`

### Packing for sending 
- `npm run pack`
