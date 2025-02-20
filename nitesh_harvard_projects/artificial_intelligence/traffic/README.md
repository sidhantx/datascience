
Convolutioal Network for classifying  Traffic images

Introduction
For this project I started with a well known CNN architecture known as VGG16. In the paper
https://arxiv.org/pdf/1409.1556v6.pdf they described the architecture with a small filter 
size of 3X3 for each convulational layer.  They used a stack of CNN layers followed by
3 Fully connected dense layers. 

My Architecture:
I used a modified version of this architecture. In my architecture I have 4 blocks. Each blocks
is composed of 2 CNN each with increasing number of filter. The base size of the filter is 32. 
With each block the number of filter increases by a factor of 2. So block 1 has 32 filters in 
each of the CNN layer, block 2 has 64 filters in each layer and so on. I did not use any hidden
Fully connected dese layers, instead just one output layer with softmax activation and 
number of nodes equal to the number of classes. I also used maxpoolinng at the end of
of each block with a size 2X2 to reduce the size of the matrix. 


 Experimentation:
 I experiemented with 3 hyperparameters.
 
 1. Number of filters at each CNN layer
 2. Dropout rates
 3. With and without L2 regularization
 4. Number of block where each block consists of 2 CNN layers with L2 regularization,
 one dropout in the last layer, and 1 maxpoolinng layer. 
 
 I first started with no regularization, and then added dropout with rates 0.1,0.2, and 0.3
 at the end of each block. I saw improved results in test accuracy with dropout =0.3. 
 I further added L2 regularization after each CNN layer in each block and saw few 
 percentage improvement in both my test and training accuracy and loss. 
 I also experimented with number of filters at each layer changing the base size. 
 The best base size was 32.  Finally, I also experiemented with number of blocks. I tried
 3, 4, and 5 blocks. 4 gave me the best train and test accuracy. 
 
 Final Thoughts:
 This was a great learning experience to see the use of CNNs and training a model with
 different hyperparameters like dropout, regularization , filter size, number of filters,
 and maxpoolinng.  
 
 
 