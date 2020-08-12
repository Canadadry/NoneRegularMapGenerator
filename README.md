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
![triangle selected to merge](screenshot3.png)

**Third Step** Sub dividing qud into 4 smaller quad

**Fourth Step** Relaxing quad to have more smooth grid



## Demo Usage

### Setup
- `npm install`
- Have LOVE installed in path

### Running
- `npm run start`

### Packing for sending 
- `npm run pack`
