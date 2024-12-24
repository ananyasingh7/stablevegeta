import React, { useEffect } from "react";

function Objective2025() {
  // Scroll to top when the component is rendered
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Objective 2025</h1>
      <p className="text-lg mb-4">
      Kicking off Objective2025 after 3+ years as a software engineer, I've been deep into full-stack development with various frameworks. I am currently in Grad school learning about Machine Learning and I realized I want to eventually transition to MLE career-wise. But I've got some knowledge gaps, so my 2025 plan is to sharpen up through all topics below via projects, and not just tutorials. I'll blog about my journey hoping to be a way better engineer by year's end. Wish me luck!
      </p>
      <p className="text-lg mb-4">(Below is just a rough draft for now)</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Fundamentals</strong>
          <ul className="list-disc pl-5">
            <li>Rust 101</li>
            <li>Computer Architecture</li>
            <li>Memory</li>
            <li>Concurrency</li>
            <li>Operating Systems</li>
            <li>Networking</li>
          </ul>
        </li>
        <li><strong>Data Structures & Algorithms</strong>
          <ul className="list-disc pl-5">
            <li>Python 101</li>
            <li>Arrays</li>
            <li>Dynamic Arrays</li>
            <li>Bit Manipulation</li>
            <li>Strings</li>
            <li>LinkedList</li>
            <li>Stacks & Queues</li>
            <li>Hash Tables/Hash Maps</li>
            <li>Binary Trees/Binary Search Trees</li>
            <li>Heaps/Priority Queues</li>
            <li>Graphs (DFS/BFS/Shortest path algos)</li>
            <li>Tries</li>
            <li>Sets</li>
            <li>Merge sort/Quicksort/Heap sort/Bubble sort</li>
            <li>Two Pointers/Sliding Window</li>
            <li>Dynamic Programming</li>
          </ul>
        </li>
        <li><strong>System Design/Software</strong>
          <ul className="list-disc pl-5">
            <li>Batch and Stream Processing</li>
            <li>Practical Software Patterns</li>
            <li>Latency and Throughput</li>
            <li>Scaling/Auto Scaling</li>
            <li>Database scaling/SQL vs NoSQL</li>
            <li>Microservices Architecture</li>
            <li>Load Balancers</li>
            <li>Caching</li>
            <li>Blob Storage (AWS S3)</li>
            <li>CDNs</li>
            <li>Message Brokers (Async)</li>
            <li>Event-Driven Architecture (EDA)</li>
            <li>Distributed Systems</li>
            <li>Consistency Models</li>
            <li>Consistent Hashing</li>
            <li>System Design Interview Book (ALL)</li>
            <li>Design Spotify (Google EM)</li>
            <li>Outco System Design Videos</li>
          </ul>
        </li>
        <li><strong>Machine Learning</strong>
          <ul className="list-disc pl-5">
            <li>Math (Linear Algebra)</li>
            <li>Math (Statistics & Probability)</li>
            <li>Hands-On Machine Learning book with Tensorflow/Keras (Chapters 1 and 2)</li>
            <li>Numpy</li>
            <li>Pandas</li>
            <li>Matplotlib & Seaborn</li>
            <li>Error Analysis</li>
            <li>Model Selection Trade-offs</li>
            <li>Supervised learning and decision boundaries</li>
            <li>Logistic Regression and nearest neighbor classifiers</li>
            <li>Parameter estimation with gradient descent</li>
            <li>Linear and polynomial models for prediction</li>
            <li>Linear regression and classification</li>
            <li>Parameter estimation</li>
            <li>Bayes rule and Naive Bayesian Classification</li>
            <li>Decision trees</li>
            <li>Ensemble learning with random forest classifiers</li>
            <li>Large-margin classification and kernels</li>
            <li>Support Vector Machines</li>
            <li>Unsupervised learning</li>
            <li>k-means/ other clustering methods</li>
            <li>Hands-On Machine Learning book with Tensorflow/Keras (finish the book)</li>
            <li>PyTorch overview</li>
            <li>Andrej Karpathy’s GPT video</li>
          </ul>
        </li>
        <li><strong>Frameworks/DBs/Misc</strong>
          <ul className="list-disc pl-5">
            <li>React and Next.js</li>
            <li>Stencil.js</li>
            <li>Apache Kafka</li>
            <li>Redis</li>
            <li>Django</li>
            <li>GraphQL</li>
            <li>AWS Certified Cloud Practitioner</li>
            <li>MongoDB</li>
            <li>VectorDB</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Objective2025;