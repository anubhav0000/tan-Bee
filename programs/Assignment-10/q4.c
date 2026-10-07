#include <stdio.h>

void displayReverse(int arr[], int n)
{
    int i;

    printf("\nArray in reverse order:\n");

    for (i = n - 1; i >= 0; i--)
    {
        printf("%d ", arr[i]);
    }
}

int main()
{
    int arr[10];
    int i;

    printf("Enter 10 integer values:\n");

    for (i = 0; i < 10; i++)
    {
        scanf("%d", &arr[i]);
    }

    displayReverse(arr, 10);

    return 0;
}
