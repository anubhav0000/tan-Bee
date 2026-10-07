#include <stdio.h>

float findAverage(int arr[], int n)
{
    int i, sum = 0;

    for (i = 0; i < n; i++)
    {
        sum = sum + arr[i];
    }

    return (float)sum / n;
}

void displayNumbers(int arr[], int n, float average)
{
    int i;

    printf("\nNumbers less than or equal to average:\n");

    for (i = 0; i < n; i++)
    {
        if (arr[i] <= average)
            printf("%d ", arr[i]);
    }

    printf("\n\nNumbers greater than average:\n");

    for (i = 0; i < n; i++)
    {
        if (arr[i] > average)
            printf("%d ", arr[i]);
    }
}

int main()
{
    int arr[10];
    int i;
    float average;

    printf("Enter 10 integer values:\n");

    for (i = 0; i < 10; i++)
    {
        scanf("%d", &arr[i]);
    }

    average = findAverage(arr, 10);

    printf("\nAverage = %.2f\n", average);

    displayNumbers(arr, 10, average);

    return 0;
}
