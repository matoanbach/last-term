#include<stdio.h>


void print(int* Crr, int N){
    printf("Result: \n");
    for(int i=0; i< N; i++)
        printf("%d ", Crr[i]);
    printf("\n");
}