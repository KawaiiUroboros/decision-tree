function DecisionTree(config) {
    if (typeof config == "object" && !Array.isArray(config)) this.training(config);
};
DecisionTree.prototype = {
         //Split function
    _predicates: {},
         //Count the number of times the attribute value is in the data set
    
countUniqueValues(items, attr) {
    var counter = {}; // Get different result values ​​and number of occurrences
for (var i of items) {
   if (!counter[i[attr]]) counter[i[attr]] = 0;
   counter[i[attr]] += 1;
}
return counter;
},

         //Get the key with the largest value in the object, assuming counter={a:9,b:2} to get "a" 
    getMaxKey(counter) {},
         //Find the most frequent specific attribute value
    mostFrequentValue(items, attr) {},
         //Cut the data set according to attributes 
    split(items, attr, predicate, pivot) {},
         //Calculate entropy
         entropy(items, attr) {
            var counter = this.countUniqueValues(items, attr); //Count the number of occurrences of the value
       var p, entropy = 0; //H(S)=entropy=∑(P(Xi)(log2(P(Xi))))
       for (var i in counter) {
                    p = counter[i] / items.length; //P(Xi) probability value
           entropy += -p * Math.log2(p); //entropy+=-(P(Xi)(log2(P(Xi))))
       }
       return entropy;
   },
      //......slightly 
buildDecisionTree(config){
    var trainingSet = config.trainingSet;//training set 
    var categoryAttr = config.categoryAttr;//The category attribute used to distinguish
    //......slightly 
    //Initial calculation of the entropy of the training set
var initialEntropy = this.entropy(trainingSet, categoryAttr);//<===H(S)
    //......slightly 
    var alreadyChecked = [];//Identification has been calculated
    var bestSplit = {gain: 0 };//Store the current best split node data information
    //Traverse the data set
for (var item of trainingSet) {
            // traverse all the attributes in the item
   for (var attr in item) {
                    //Skip distinguishing attributes and ignoring attributes
       if ((attr == categoryAttr) || (ignoredAttributes.indexOf(attr) >= 0)) continue;
                    var pivot = item[attr];// current attribute value 
                    var predicateName = ((typeof pivot =='number')?'>=':'=='); //Select the judgment condition according to the data type
       var attrPredPivot = attr + predicateName + pivot;
                    if (alreadyChecked.indexOf(attrPredPivot) >= 0) continue;//Skip it has been calculated
                    alreadyChecked.push(attrPredPivot);//record
                    var predicate = this._predicates[predicateName];//match split method
       var currSplit = this.split(trainingSet, attr, predicate, pivot);
                    var matchEntropy = this.entropy(currSplit.match, categoryAttr);// H(match) Calculate the entropy of the appropriate data set after segmentation
                    var notMatchEntropy = this.entropy(currSplit.notMatch, categoryAttr);// H(on match) Calculate the entropy of the inappropriate data set after segmentation
                      //Calculate information gain: 
        // IG(A,S)=H(S)-(∑P(t)H(t))) 
                      // t is the split subset match (match), on match (not match)
                      // P(match)=length of match/length of data set
                      // P(on match)=length of on match/length of data set
        var iGain = initialEntropy - ((matchEntropy * currSplit.match.length
                   + notMatchEntropy * currSplit.notMatch.length) / trainingSet.length);
         //Continuously match the node information corresponding to the best gain value
         if (iGain > bestSplit.gain) {
                                //......slightly 
         }
   }
} 
    //...Recursive calculation branch
}
,
         //Initialize to generate decision tree
    training(config) {},
         //Prediction test
     //......slightly 
 //Prediction test
predict(data) {
    var attr, value, predicate, pivot;
    var tree = this.root;
    while (true) {
        if (tree.category) {
            return tree.category;
        }
        attr = tree.attribute;
        value = data[attr];
        predicate = tree.predicate;
        pivot = tree.pivot;
        if (predicate(value, pivot)) {
            tree = tree.match;
        } else {
            tree = tree.notMatch;
        }
    }
}
,
};
var data =
[
                 {"Name": "Yu Xia", "Age": 29, "Appearance": "Handsome", "Body Type": "Slim", "Income": "High", Meeting: "See" },
                 {"Name": "Peas", "Age": 25, "Appearance": "Handsome", "Body Type": "Slim", "Income": "High", Meet: "See" },
                 {"Name": "Handsome Changrong", "Age": 26, "Appearance": "Handsome", "Body Type": "Fat", "Income": "High", Meeting: "See" },
                 {"Name": "Wang Tao", "Age": 22, "Appearance": "Handsome", "Body Type": "Slim", "Income": "High", Meet: "See" },
                 {"Name": "Li Dong", "Age": 23, "Appearance": "Handsome", "Body Type": "Slim", "Income": "High", Meet: "See" },
                 {"Name": "Wang Wuwu", "Age": 23, "Appearance": "Handsome", "Body Type": "Slim", "Income": "Low", Meet: "See" },
                 {"Name": "Wang Xiaotao", "Age": 22, "Appearance": "Handsome", "Body Type": "Slim", "Income": "Low", Meet: "See" },
                 {"Name": "Li Bin", "Age": 21, "Appearance": "Handsome", "Body Type": "Fat", "Income": "High", Meeting: "See" },
                 {"Name": "Liu Ming", "Age": 21, "Appearance": "Handsome", "Body Type": "Fat", "Income": "Low", Meet: "Not See" },
                 {"Name": "Red Crane", "Age": 21, "Appearance": "Not handsome", "Body Type": "Fat", "Income": "High", Meet: "Not See" },
                 {"Name": "Li Li", "Age": 32, "Appearance": "Handsome", "Body Type": "Slim", "Income": "High", Meet: "Not See" },
                 {"Name": "Zhouzhou", "Age": 31, "Appearance": "Handsome", "Body Type": "Slim", "Income": "High", Meet: "Not See" },
                 {"Name": "Li Le", "Age": 27, "Appearance": "Not handsome", "Body": "Fat", "Income": "High", Meet: "Not See" },
                 {"Name": "Han Ming", "Age": 24, "Appearance": "Not handsome", "Body": "Slim", "Income": "High", Meet: "Not See" },
                 {"Name": "Little Lu", "Age": 28, "Appearance": "Handsome", "Body Type": "Slim", "Income": "Low", Meet: "Not See" },
                 {"Name": "Li Si", "Age": 25, "Appearance": "Handsome", "Body Type": "Slim", "Income": "Low", Meet: "Not See" },
                 {"Name": "Wang Peng", "Age": 30, "Appearance": "Handsome", "Body Type": "Slim", "Income": "Low", Meet: "Not See" },
];
var decisionTree = new DecisionTree();
console.log("Function countUniqueValues ​​test:");
console.log("looks", decisionTree.countUniqueValues(data, "looks")); //test
console.log("Age", decisionTree.countUniqueValues(data, "Age")); //Test
console.log("Income", decisionTree.countUniqueValues(data, "Income")); //Test
console.log("Function entropy test:");
console.log("looks", decisionTree.entropy(data, "looks")); //test
console.log("Age", decisionTree.entropy(data, "Age")); //Test
console.log("Income", decisionTree.entropy(data, "Income")); 